import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../../types";
import { RootState } from "../store";

interface ChatState {
  reducerChat: Chat | null;
  reducerChatHistory: Chat[];
}

const initialChatState: ChatState = {
  reducerChat: null,
  reducerChatHistory: [],
};

const userThreadsSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    setChatReducerState: (state, action: PayloadAction<Partial<ChatState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setChatReducerState } = userThreadsSlice.actions;
export const getChatReducerState = (state: RootState) => state.chat;
export default userThreadsSlice.reducer;
