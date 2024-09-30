import { Dispatch } from "@reduxjs/toolkit";
import { setSharedRequest, removeSharedRequest } from "../slices/slice-shared";
import { appendThreadMessage, setThreadState } from "../slices/slice-thread";
import { duckDuckGoSearch } from "@/lib/api/api-search";
import { v4 as uuidv4 } from "uuid";
import { ThreadMessageGroupType } from "@/lib/types";
import { store } from "../store";
import { transformUserQuery } from "@/lib/ai-agents/transform-user-query";
import getSearchAnswer from "@/lib/ai-agents/get-search-answer";

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

export const reduxSendQuery = (query: string) => async (dispatch: Dispatch) => {
  const currentThreadID = store.getState().thread?.id;

  dispatch(setSharedRequest("SEND_QUERY"));

  try {
    const threadID = currentThreadID || uuidv4();

    dispatch(setThreadState({ id: threadID, status: "generating" }));

    const transformedQuery = await transformUserQuery(query);

    const searchResults = await duckDuckGoSearch({
      query: transformedQuery,
      maxResults: 2,
    });

    const answer = await getSearchAnswer({ searchResults });

    const messageObject: ThreadMessageGroupType = {
      query,
      transformedQuery,
      messages: [
        {
          type: "knowledge-graph",
          content: searchResults,
        },
        { type: "text", content: answer },
      ],
    };

    dispatch(appendThreadMessage(messageObject));
  } catch (error) {
    console.error("Error in reduxSendQuery:", error);
    dispatch(setThreadState({ status: "error" }));
  } finally {
    dispatch(setThreadState({ status: "idle" }));
    dispatch(removeSharedRequest("SEND_QUERY"));
  }
};
