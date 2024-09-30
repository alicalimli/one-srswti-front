import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user";
import sharedSlice from "./slices/slice-shared";
import userThreadsSlice from "./slices/slice-user-threads";
import appStateSlice from "./slices/slice-app-state";
import threadSlice from "./slices/slice-thread";
export const store = configureStore({
  reducer: {
    user: userSlice,
    shared: sharedSlice,
    chat: userThreadsSlice,
    thread: threadSlice,
    appState: appStateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
