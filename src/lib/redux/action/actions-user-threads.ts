import { supabase } from "@/lib/supabase/supabase";
import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { removeSharedRequest, setSharedRequest } from "../slices/slice-shared";
import { setChatReducerState } from "../slices/slice-user-threads";
import { store } from "../store";
import { clearThread } from "../slices/slice-thread";

export const reduxGetChatHistory = () => async (dispatch: Dispatch) => {
  const currentUser = store.getState().user.user;

  dispatch(setSharedRequest("GET_CHAT_HISTORY"));
  try {
    const { data: threads, error } = await supabase
      .from("one_srswti_threads")
      .select("*")
      .eq("user_id", currentUser?.id || "anonymous")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    console.log(threads);

    dispatch(setChatReducerState({ reducerChatHistory: threads }));
  } catch (error) {
    console.error("Error fetching thread history:", error);
    toast.error("Failed to load thread history");
  } finally {
    dispatch(removeSharedRequest("GET_CHAT_HISTORY"));
  }
};

export const reduxClearChatHistory = () => async (dispatch: Dispatch) => {
  const currentUser = store.getState().user.user;

  dispatch(setSharedRequest("CLEAR_CHAT_HISTORY"));
  try {
    const { error } = await supabase
      .from("one_srswti_threads")
      .delete()
      .eq("user_id", currentUser?.id || "anonymous");

    if (error) {
      throw new Error(error.message);
    }

    dispatch(setChatReducerState({ reducerChatHistory: [] }));
    dispatch(clearThread());
    toast.success("Chat history cleared");
  } catch (error) {
    console.error("Error clearing chat history:", error);
    toast.error("Failed to clear chat history");
  } finally {
    dispatch(removeSharedRequest("CLEAR_CHAT_HISTORY"));
  }
};
