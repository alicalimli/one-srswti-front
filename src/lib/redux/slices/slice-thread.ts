import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ThreadMessageGroupType } from "@/lib/types";

interface ThreadState {
  messageGroups: ThreadMessageGroupType[];
  isBookmarked: boolean;
  isPublic: boolean;
  id: string | null;
  status: "idle" | "generating" | "success" | "error";
}

const initialThreadState: ThreadState = {
  messageGroups: [],
  isBookmarked: false,
  id: null,
  isPublic: false,
  status: "idle",
};

const threadSlice = createSlice({
  name: "thread",
  initialState: initialThreadState,
  reducers: {
    setThreadState: (state, action: PayloadAction<Partial<ThreadState>>) => {
      return { ...state, ...action.payload };
    },
    clearThread: () => {
      return initialThreadState;
    },
    appendThreadMessage: (
      state,
      action: PayloadAction<ThreadMessageGroupType>
    ) => {
      return {
        ...state,
        messageGroups: [...state.messageGroups, action.payload],
      };
    },
  },
});

export const { setThreadState, clearThread, appendThreadMessage } =
  threadSlice.actions;
export const getThreadState = (state: RootState) => state.thread;
export default threadSlice.reducer;
