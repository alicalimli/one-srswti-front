import { Dispatch } from "@reduxjs/toolkit";
import { setSharedRequest, removeSharedRequest } from "../slices/slice-shared";
import { setThreadState } from "../slices/slice-thread";
import { duckDuckGoSearch } from "@/lib/api/api-search";
import { v4 as uuidv4 } from "uuid";
import { UpdateInquiriesType, ThreadMessageGroupType } from "@/lib/types";
import { store } from "../store";
import { transformUserQuery } from "@/lib/ai-agents/transform-user-query";
import getSearchAnswer from "@/lib/ai-agents/get-search-answer";
import { getStructuredResultContext } from "@/lib/utils/get-structured-result-context";
import shouldInquire from "@/lib/ai-agents/should-inquire";
import { InquiryType } from "@/components/app/thread-messages/inquire/inquire";

export const reduxBookmarkThread = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("BOOKMARK_THREAD"));
  try {
    console.log("reduxBookmarkThread action called");
    // dispatch(bookmarkThread());
  } catch (error) {
    console.error("Error in reduxBookmarkThread:", error);
  } finally {
    dispatch(removeSharedRequest("BOOKMARK_THREAD"));
  }
};

export const reduxShareThread = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("SHARE_THREAD"));
  try {
    console.log("reduxShareThread action called");
    // dispatch(shareThread());
  } catch (error) {
    console.error("Error in reduxShareThread:", error);
  } finally {
    dispatch(removeSharedRequest("SHARE_THREAD"));
  }
};

const getUserAssitantMessages = (history: ThreadMessageGroupType[]) => {
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
  if (hasSkipped) {
    return history.filter(
      (group) =>
        !updateInquiries.map((inquiry) => inquiry.id).includes(group.id)
    );
  }

  const updatedHistory = history.map((group) => {
    const inquiryUpdate = updateInquiries.find(
      (inquiry) => inquiry.id === group.id
    );
    if (inquiryUpdate) {
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
}: {
  historyContext: string;
  query: string;
  skipInquire?: boolean;
}) => {
  const maxInquiries = 3;

  const shouldRenderInquire:
    | { choices: string[]; question: string }
    | "proceed" =
    inquireCount <= maxInquiries
      ? await shouldInquire({
          context: historyContext,
        })
      : "proceed";

  if (!skipInquire && shouldRenderInquire !== "proceed") {
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
      type: "inquiry",
      inquiry: dummyInquiry,
      query: "",
      transformedQuery: "",
      messages: [],
    };

    return { inquiryBlock };
  }

  inquireCount = 0;
  return { inquiryBlock: null };
};

export const reduxSendQuery =
  ({
    query,
    messages,
    skipInquire,
    updateInquiries,
  }: {
    query: string;
    skipInquire?: boolean;
    messages: ThreadMessageGroupType[];
    updateInquiries?: UpdateInquiriesType[];
  }) =>
  async (dispatch: Dispatch) => {
    const currentThreadID = store.getState().thread?.id;
    const currentMessages = store.getState().thread?.messageGroups;

    dispatch(setSharedRequest("SEND_QUERY"));

    try {
      const threadID = currentThreadID || uuidv4();

      dispatch(setThreadState({ id: threadID, status: "generating" }));

      let history = [...currentMessages, ...messages];
      history = updateInquiries?.length
        ? updateInquireBlocks({
            history,
            dispatch,
            updateInquiries,
            hasSkipped: skipInquire || false,
          })
        : history;

      const historyContext = `
      Here's is the message history of the user and their query:
      ${JSON.stringify(getUserAssitantMessages(history))}
    `;

      const { inquiryBlock } = await checkInquiry({
        historyContext,
        query,
        skipInquire,
      });

      if (inquiryBlock) {
        history.push(inquiryBlock);
        dispatch(setThreadState({ messageGroups: history }));
        return;
      }

      const transformedQuery = await transformUserQuery({
        query,
        historyContext,
      });

      const searchResults = await duckDuckGoSearch({
        query: transformedQuery,
        maxResults: 5,
      });
      const resultContext = getStructuredResultContext(searchResults);

      const answer = await getSearchAnswer({ context: resultContext });

      const messageObject: ThreadMessageGroupType = {
        id: uuidv4(),
        query,
        transformedQuery,
        messages: [
          {
            role: "knowledge-graph",
            content: searchResults,
          },
          { role: "text", content: answer },
        ],
      };

      history.push(messageObject);
      dispatch(setThreadState({ messageGroups: history }));
    } catch (error) {
      console.error("Error in reduxSendQuery:", error);
      dispatch(setThreadState({ status: "error" }));
    } finally {
      dispatch(setThreadState({ status: "idle" }));
      dispatch(removeSharedRequest("SEND_QUERY"));
    }
  };
