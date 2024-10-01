import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ThreadMessageGroupType } from "@/lib/types";

interface ThreadState {
  messageGroups: ThreadMessageGroupType[];
  id: string | null;
  bookmarked: boolean;
  shared: boolean;
  status: "idle" | "fetching" | "generating" | "success" | "error";
}

const initialThreadState: ThreadState = {
  messageGroups: [],
  id: null,
  bookmarked: false,
  shared: false,
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
    updateThreadMessage: (
      state,
      action: PayloadAction<ThreadMessageGroupType>
    ) => {
      const updatedMessageGroups = state.messageGroups.map((group) =>
        group.id === action.payload.id ? action.payload : group
      );
      return {
        ...state,
        messageGroups: updatedMessageGroups,
      };
    },
    appendThreadMessage: (
      state,
      action: PayloadAction<ThreadMessageGroupType[]>
    ) => {
      return {
        ...state,
        messageGroups: [...state.messageGroups, ...action.payload],
      };
    },
  },
});

export const {
  setThreadState,
  updateThreadMessage,
  clearThread,
  appendThreadMessage,
} = threadSlice.actions;
export const getThreadState = (state: RootState) => state.thread;
export default threadSlice.reducer;
