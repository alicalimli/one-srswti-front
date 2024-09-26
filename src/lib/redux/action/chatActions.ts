// import { Dispatch } from "@reduxjs/toolkit";
// import { removeSharedRequest, setSharedRequest } from "../slices/shared";
// import { setChatReducerState } from "../slices/chat";
// import { toast } from "sonner";
// import {
//   getChat,
//   saveChat,
//   updateChat,
//   getChats,
//   clearChats,
// } from "@/lib/actions/chat";
// import { Chat } from "@/lib/types";

// export const reduxGetChat =
//   (chatId: string, userId: string = "anonymous") =>
//   async (dispatch: Dispatch) => {
//     dispatch(setSharedRequest("GET_CHAT"));
//     try {
//       const chat = await getChat(chatId, userId);

//       if (!chat) {
//         throw new Error("Chat not found");
//       }

//       dispatch(setChatReducerState({ reducerChat: chat }));
//     } catch (error) {
//       console.error("Error fetching chat:", error);
//     } finally {
//       dispatch(removeSharedRequest("GET_CHAT"));
//     }
//   };

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

// export const reduxGetChatHistory =
//   (userId: string = "anonymous") =>
//   async (dispatch: Dispatch) => {
//     dispatch(setSharedRequest("GET_CHAT_HISTORY"));
//     try {
//       const chats = await getChats(userId);

//       // Convert Date objects to ISO strings
//       const serializedChats = chats.map((chat) => ({
//         ...chat,
//         createdAt:
//           chat.createdAt instanceof Date
//             ? chat.createdAt.toISOString()
//             : chat.createdAt,
//         updatedAt:
//           chat.updatedAt instanceof Date
//             ? chat.updatedAt.toISOString()
//             : chat.updatedAt,
//       }));

//       dispatch(setChatReducerState({ reducerChatHistory: serializedChats }));
//     } catch (error) {
//       console.error("Error fetching chat history:", error);
//       toast.error("Failed to load chat history");
//     } finally {
//       dispatch(removeSharedRequest("GET_CHAT_HISTORY"));
//     }
//   };

// export const reduxClearChatHistory =
//   (userId: string = "anonymous") =>
//   async (dispatch: Dispatch) => {
//     dispatch(setSharedRequest("CLEAR_CHAT_HISTORY"));
//     try {
//       const result = await clearChats(userId);
//       if (result?.error) {
//         throw new Error(result.error);
//       }
//       dispatch(setChatReducerState({ reducerChatHistory: [] }));
//       toast.success("History cleared");
//     } catch (error) {
//       console.error("Error clearing chat history:", error);
//       toast.error("Failed to clear chat history");
//     } finally {
//       dispatch(removeSharedRequest("CLEAR_CHAT_HISTORY"));
//     }
//   };
