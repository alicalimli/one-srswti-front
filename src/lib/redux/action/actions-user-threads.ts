import { Dispatch } from "@reduxjs/toolkit";
import { removeSharedRequest, setSharedRequest } from "../slices/slice-shared";
import { setChatReducerState } from "../slices/slice-user-threads";
import { toast } from "sonner";
import {
  getChat,
  saveChat,
  updateChat,
  getChats,
  clearChats,
} from "@/lib/actions/chat";
import { Chat } from "@/lib/types";
import { supabase } from "@/lib/supabase/supabase";
import { store } from "../store";

export const reduxGetChat =
  (chatId: string, userId: string = "anonymous") =>
  async (dispatch: Dispatch) => {
    dispatch(setSharedRequest("GET_CHAT"));
    try {
      const response = await fetch(`http://localhost:3000/api/chats/${userId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const chat = await response.json();

      if (!chat) {
        throw new Error("Chat not found");
      }

      dispatch(setChatReducerState({ reducerChat: chat }));
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      dispatch(removeSharedRequest("GET_CHAT"));
    }
  };

// export const reduxShareChat =
//   (chatId: string, userId: string = "anonymous") =>
//   async (dispatch: Dispatch) => {
//     dispatch(setSharedRequest("SHARE_CHAT"));
//     try {
//       const currentChat = await getChat(chatId, userId);

//       if (!currentChat) {
//         throw new Error("Chat not found");
//       }
//       const updatedChat: Chat = { ...currentChat, shared: !currentChat.shared };

//       await saveChat(updatedChat, userId);

//       if (!updatedChat) {
//         throw new Error("Failed to update chat");
//       }

//       dispatch(setChatReducerState({ reducerChat: updatedChat }));
//       toast.success(
//         updatedChat.shared ? "Chat is now public" : "Chat is now private"
//       );
//     } catch (error) {
//       console.error("Error updating chat sharing status:", error);
//       toast.error("Failed to update chat sharing status");
//     } finally {
//       dispatch(removeSharedRequest("SHARE_CHAT"));
//     }
//   };

// export const reduxBookmarkChat =
//   (chat: Chat, userId: string = "anonymous") =>
//   async (dispatch: Dispatch) => {
//     dispatch(setSharedRequest("BOOKMARK_CHAT"));

//     try {
//       const updatedChat: Chat = { ...chat, bookmarked: !chat.bookmarked };
//       dispatch(setChatReducerState({ reducerChat: updatedChat }));

//       await saveChat(updatedChat, userId);

//       toast.success(
//         updatedChat.bookmarked ? "Chat bookmarked" : "Chat unbookmarked"
//       );
//     } catch (error) {
//       console.error("Error bookmarking chat:", error);

//       dispatch(
//         setChatReducerState({
//           reducerChat: { ...chat, bookmarked: false },
//         })
//       );

//       toast.error("Failed to bookmark chat");
//     } finally {
//       dispatch(removeSharedRequest("BOOKMARK_CHAT"));
//     }
//   };

// export const clearReducerChat = () => async (dispatch: Dispatch) => {
//   dispatch(setChatReducerState({ reducerChat: null }));
// };

export const reduxGetChatHistory = () => async (dispatch: Dispatch) => {
  const currentUser = store.getState().user.user;

  dispatch(setSharedRequest("GET_CHAT_HISTORY"));
  try {
    const { data: threads, error } = await supabase
      .from("one_srswti_threads")
      .select("*")
      .eq("user_id", currentUser?.id || "anonymous");

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
    toast.success("Chat history cleared");
  } catch (error) {
    console.error("Error clearing chat history:", error);
    toast.error("Failed to clear chat history");
  } finally {
    dispatch(removeSharedRequest("CLEAR_CHAT_HISTORY"));
  }
};
