import { Dispatch } from "@reduxjs/toolkit";
import { setSharedRequest, removeSharedRequest } from "../slices/slice-shared";
import { appendThreadMessage, setThreadState } from "../slices/slice-thread";
import { duckDuckGoSearch } from "@/lib/api/api-search";
import { v4 as uuidv4 } from "uuid";
import { UpdateInquiriesType, ThreadMessageGroupType } from "@/lib/types";
import { RootState, store } from "../store";
import { transformUserQuery } from "@/lib/ai-agents/transform-user-query";
import getSearchAnswer from "@/lib/ai-agents/get-search-answer";
import { getStructuredResultContext } from "@/lib/utils/get-structured-result-context";
import shouldInquire from "@/lib/ai-agents/should-inquire";
import { InquiryType } from "@/components/app/thread-messages/inquire/inquire";
import { supabase } from "@/lib/supabase/supabase";

const getUserAssitantMessages = (history: ThreadMessageGroupType[]) => {
  console.log("Getting user and assistant messages from history");
  return history.flatMap((group) =>
    group.messages.filter(
      (msg) => msg.role === "user" || msg.role === "assistant"
    )
  );
};
const updateInquireBlocks = async ({
  updateInquiries,
}: {
  updateInquiries: UpdateInquiriesType[];
}) => {
  console.log("Updating inquire blocks");

  for (const inquiry of updateInquiries) {
    try {
      const { error } = await supabase
        .from("one_srswti_thread_groups")
        .update({ inquiry: inquiry.data })
        .eq("id", inquiry.id);

      if (error) {
        console.error(`Error updating inquiry ${inquiry.id}:`, error);
      } else {
        console.log(`Successfully updated inquiry ${inquiry.id}`);
      }
    } catch (error) {
      console.error(`Error updating inquiry ${inquiry.id}:`, error);
    }
  }
};

let inquireCount = 0;

const checkInquiry = async ({
  historyContext,
  query,
  skipInquire,
  threadID,
}: {
  historyContext: string;
  query: string;
  skipInquire?: boolean;
  threadID: string;
}) => {
  const currentUser = store.getState().user?.user;
  const llmMode = store.getState().appState.activeMode;
  const focusMode = store.getState().appState.focusMode;

  const maxInquiries = focusMode ? 5 : 3;

  const shouldRenderInquire:
    | { choices: string[]; question: string }
    | "proceed" =
    inquireCount < maxInquiries
      ? await shouldInquire({
          context: historyContext,
          llmMode: focusMode ? llmMode : null,
        })
      : "proceed";

  console.log(`Should render inquire: ${JSON.stringify(shouldRenderInquire)}`);

  if (!skipInquire && shouldRenderInquire !== "proceed") {
    console.log("Creating inquiry block");
    inquireCount++;

    const dummyInquiry: InquiryType = {
      question: shouldRenderInquire.question,
      choices: shouldRenderInquire.choices,
      userQuery: query,
      allowsInput: true,
      inputLabel: "Other (please specify)",
      inputPlaceholder: "Type your answer here...",
    };

    const inquiryBlock: ThreadMessageGroupType = {
      id: uuidv4(),
      thread_id: threadID,
      user_id: currentUser?.id || "anonymous",
      type: "inquiry",
      inquiry: dummyInquiry,
      query: "",
      transformed_query: "",
      messages: [],
    };

    return { inquiryBlock };
  }

  inquireCount = 0;
  return { inquiryBlock: null };
};

const insertMessagesToDB = async ({
  messages,
}: {
  messages: ThreadMessageGroupType[];
}) => {
  console.log("Inserting messages to DB");
  const { error } = await supabase
    .from("one_srswti_thread_groups")
    .insert(messages);

  if (error) {
    console.log("Error inserting messages to DB:", error);
    throw new Error("Coudn't store messages in the db");
  }
};

export const reduxSendQuery =
  ({
    query,
    messages: messagesToInsert,
    skipInquire,
    updateInquiries,
  }: {
    query: string;
    skipInquire?: boolean;
    messages: Omit<ThreadMessageGroupType, "thread_id" | "user_id">[];
    updateInquiries?: UpdateInquiriesType[];
  }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const currentUser = getState().user?.user;
    const currentThreadID = getState().thread?.id;
    const currentMessages = getState().thread?.messageGroups;
    const focusMode = store.getState().appState.focusMode;
    const llmMode = store.getState().appState.activeMode;

    const threadID = currentThreadID ?? uuidv4();

    const messages = messagesToInsert.map((message) => ({
      ...message,
      id: uuidv4(),
      thread_id: threadID,
      user_id: currentUser?.id || "anonymous",
    }));

    dispatch(setSharedRequest("SEND_QUERY"));
    dispatch(setThreadState({ id: threadID, status: "generating" }));

    const shouldContinue = () => {
      const currentState = getState();
      return currentState.thread?.id === threadID;
    };

    try {
      if (!currentThreadID) {
        console.log("Creating new thread in DB");
        const { error } = await supabase.from("one_srswti_threads").insert([
          {
            id: threadID,
            title: query,
            user_id: currentUser?.id || "anonymous",
          },
        ]);

        if (error) {
          console.log("DB THREAD CREATION ERROR", error);
          throw new Error("Couldn't create thread data in the db.");
        }
      }

      if (!shouldContinue()) return;

      const newMessages = [...messages];
      const overallMessages = [...currentMessages, ...newMessages];

      if (updateInquiries) {
        updateInquireBlocks({
          updateInquiries,
        });
      }

      const historyContext = `
      Here's the message history of the user and their query:
      ${JSON.stringify(getUserAssitantMessages(overallMessages))}
    `;

      const { inquiryBlock } = await checkInquiry({
        historyContext,
        query,
        skipInquire,
        threadID,
      });

      if (!shouldContinue()) return;

      if (inquiryBlock) {
        console.log("Inquiry block created, appending to messages");
        newMessages.push(inquiryBlock);

        await insertMessagesToDB({ messages: newMessages });
        dispatch(appendThreadMessage(newMessages));
        return;
      }

      console.log("Transforming user query");
      const transformed_query = await transformUserQuery({
        query,
        historyContext,
      });

      if (!shouldContinue()) return;

      console.log("Performing DuckDuckGo search");
      const searchType = focusMode && llmMode === "social" ? "news" : "general";

      const searchResults = await duckDuckGoSearch({
        searchType,
        quickSearch: false,
        query: transformed_query,
        maxResults: focusMode ? 1 : 1,
      });
      const resultContext = getStructuredResultContext(searchResults);

      if (!shouldContinue()) return;

      console.log("Getting search answer");
      const answer = await getSearchAnswer({
        llmMode: focusMode ? llmMode : null,
        context: resultContext,
      });

      if (!shouldContinue()) return;

      const messageObject: ThreadMessageGroupType = {
        id: uuidv4(),
        user_id: currentUser?.id || "anonymous",
        query,
        thread_id: threadID,
        transformed_query,
        messages: [
          {
            role: "knowledge-graph",
            content: searchResults,
          },
          { role: "text", content: answer },
        ],
      };

      console.log("Appending new message to thread");
      newMessages.push(messageObject);

      if (shouldContinue()) {
        await insertMessagesToDB({ messages: newMessages });
        dispatch(appendThreadMessage(newMessages));
      }
    } catch (error) {
      console.error("Error in reduxSendQuery:", error);
      if (shouldContinue()) {
        dispatch(setThreadState({ status: "error" }));
      }
    } finally {
      console.log("Finishing reduxSendQuery");

      if (shouldContinue()) {
        dispatch(setThreadState({ status: "idle" }));
        dispatch(removeSharedRequest("SEND_QUERY"));
      } else {
        console.log("Thread changed or cleared. Skipping final state updates.");
      }
    }
  };
