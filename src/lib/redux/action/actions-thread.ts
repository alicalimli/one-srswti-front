import { Dispatch } from "@reduxjs/toolkit";
import { setSharedRequest, removeSharedRequest } from "../slices/slice-shared";
import { setThreadState } from "../slices/slice-thread";

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
  dispatch(setSharedRequest("SEND_QUERY"));
  try {
    dispatch(setThreadState({ status: "loading" }));
    console.log("reduxSendQuery action called with query:", query);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // const fetchResponse = async () => {
    //   if (initialQuery) {
    //     try {
    //       const res = await srswtiInference({
    //         question: initialQuery,
    //         withBs64: false,
    //         extraPayload: {
    //           user_id: "ebee54f3-7691-4e3c-a895-a7d7a508af7a", // You might want to replace this with actual user ID
    //         },
    //       });

    //       console.log(res);
    //     } catch (error) {
    //       console.error("Error fetching response:", error);
    //     }
    //   }
    // };

    // fetchResponse();
  } catch (error) {
    console.error("Error in reduxSendQuery:", error);
    dispatch(setThreadState({ status: "error" }));
  } finally {
    dispatch(setThreadState({ status: "idle" }));
    dispatch(removeSharedRequest("SEND_QUERY"));
  }
};
