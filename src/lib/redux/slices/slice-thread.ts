import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ThreadState {
  messages: string[];
  isBookmarked: boolean;
  isPublic: boolean;
  status: "idle" | "loading" | "success" | "error";
}

const initialThreadState: ThreadState = {
  messages: [],
  isBookmarked: false,
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
  },
});

export const { setThreadState } = threadSlice.actions;
export const getThreadState = (state: RootState) => state.thread;
export default threadSlice.reducer;
