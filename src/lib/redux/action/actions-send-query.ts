import { Dispatch } from "@reduxjs/toolkit";
import { setSharedRequest, removeSharedRequest } from "../slices/slice-shared";
import { appendThreadMessage, setThreadState } from "../slices/slice-thread";
import { duckDuckGoSearch } from "@/lib/api/api-search";
import { v4 as uuidv4 } from "uuid";
import { UpdateInquiriesType, ThreadMessageGroupType } from "@/lib/types";
import { store } from "../store";
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
const updateInquireBlocks = ({
  history,
  updateInquiries,
  hasSkipped,
}: {
  history: ThreadMessageGroupType[];
  updateInquiries: UpdateInquiriesType[];
  hasSkipped: boolean;
  dispatch: Dispatch;
}) => {
  console.log("Updating inquire blocks");
  return history.filter(
    (group) => !updateInquiries.map((inquiry) => inquiry.id).includes(group.id)
  );

  const updatedHistory = history.map((group) => {
    const inquiryUpdate = updateInquiries.find(
      (inquiry) => inquiry.id === group.id
    );
    if (inquiryUpdate) {
      console.log(`Updating inquiry for group ${group.id}`);
      return {
        ...group,
        messages: group.messages.map((message) => ({
          ...message,
          checkedAnswers: inquiryUpdate.answers,
        })),
      };
    }
    return group;
  });

  return updatedHistory;
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
  console.log("Checking inquiry");
  const currentUser = store.getState().user?.user;

  const maxInquiries = 3;
  console.log(inquireCount);
  const shouldRenderInquire:
    | { choices: string[]; question: string }
    | "proceed" =
    inquireCount <= maxInquiries
      ? await shouldInquire({
          context: historyContext,
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
  async (dispatch: Dispatch) => {
    console.log("Starting reduxSendQuery");
    const currentUser = store.getState().user?.user;
    const currentThreadID = store.getState().thread?.id;
    const currentMessages = store.getState().thread?.messageGroups;

    const threadID = currentThreadID || uuidv4();

    const messages = messagesToInsert.map((message) => ({
      ...message,
      id: uuidv4(),
      thread_id: threadID,
      user_id: currentUser?.id || "anonymous",
    }));

    dispatch(setSharedRequest("SEND_QUERY"));
    dispatch(setThreadState({ id: threadID, status: "generating" }));

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
          throw new Error("Coudn't create thread data in the db.");
        }
      }

      const newMessages = [...messages];
      const overallMessages = [...currentMessages, ...newMessages];
      // newMessages = updateInquiries?.length
      //   ? updateInquireBlocks({
      //       hitsory: newMessages,
      //       dispatch,
      //       updateInquiries,
      //       hasSkipped: skipInquire || false,
      //     })
      //   : newMessages;

      const historyContext = `
      Here's is the message history of the user and their query:
      ${JSON.stringify(getUserAssitantMessages(overallMessages))}
    `;

      const { inquiryBlock } = await checkInquiry({
        historyContext,
        query,
        skipInquire,
        threadID,
      });

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

      console.log("Performing DuckDuckGo search");
      const searchResults = await duckDuckGoSearch({
        query: transformed_query,
        maxResults: 5,
      });
      const resultContext = getStructuredResultContext(searchResults);

      console.log("Getting search answer");
      const answer = await getSearchAnswer({ context: resultContext });

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
      await insertMessagesToDB({ messages: newMessages });
      dispatch(appendThreadMessage(newMessages));
    } catch (error) {
      console.error("Error in reduxSendQuery:", error);
      dispatch(setThreadState({ status: "error" }));
    } finally {
      console.log("Finishing reduxSendQuery");
      dispatch(setThreadState({ status: "idle" }));
      dispatch(removeSharedRequest("SEND_QUERY"));
    }
  };
