import { Dispatch } from "@reduxjs/toolkit";
import { removeSharedRequest, setSharedRequest } from "../slices/slice-shared";
import { supabase } from "@/lib/supabase/supabase";
import { setThreadState } from "../slices/slice-thread";
import { store } from "../store";
import { toast } from "sonner";

export const reduxBookmarkThread = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("BOOKMARK_THREAD"));
  try {
    const state = store.getState();
    const { id, bookmarked } = state.thread;
    const userId = state.user.user?.id || "anonymous";

    if (!id) {
      throw new Error("Thread ID not found");
    }

    const { data, error } = await supabase
      .from("one_srswti_threads")
      .update({ bookmarked: !bookmarked })
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    dispatch(setThreadState({ bookmarked: !bookmarked }));
    console.log(
      `Thread ${bookmarked ? "unbookmarked" : "bookmarked"} successfully`
    );
  } catch (error) {
    console.error("Error in reduxBookmarkThread:", error);
  } finally {
    dispatch(removeSharedRequest("BOOKMARK_THREAD"));
  }
};

export const reduxShareThread = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("SHARE_THREAD"));
  try {
    const state = store.getState();
    const { id, shared } = state.thread;
    const userId = state.user.user?.id || "anonymous";

    if (!id) {
      throw new Error("Thread ID not found");
    }

    const { data, error } = await supabase
      .from("one_srswti_threads")
      .update({ shared: !shared })
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    dispatch(setThreadState({ shared: !shared }));
    toast.success(
      `Thread ${shared ? "Unpublished" : "published"} successfully`
    );
  } catch (error) {
    console.error("Error in reduxShareThread:", error);
  } finally {
    dispatch(removeSharedRequest("SHARE_THREAD"));
  }
};

export const reduxGetExistingThread =
  (threadID: string) => async (dispatch: Dispatch) => {
    dispatch(setSharedRequest("GET_EXISTING_THREAD"));
    dispatch(setThreadState({ status: "fetching" }));

    try {
      const { data: threadData, error: threadError } = await supabase
        .from("one_srswti_threads")
        .select("*")
        .eq("id", threadID)
        .single();

      if (threadError) {
        throw threadError;
      }

      const { data, error } = await supabase
        .from("one_srswti_thread_groups")
        .select("*")
        .eq("thread_id", threadID);

      if (error) {
        throw error;
      }

      if (data) {
        dispatch(
          setThreadState({
            messageGroups: data,
            id: threadID,
            bookmarked: threadData.bookmarked,
            shared: threadData.shared,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching existing thread:", error);
    } finally {
      dispatch(setThreadState({ status: "idle" }));
      dispatch(removeSharedRequest("GET_EXISTING_THREAD"));
    }
  };
