import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user";
import sharedSlice from "./slices/shared";
import chatSlice from "./slices/chat";
import appStateSlice from "./slices/sliceAppState";

export const store = configureStore({
  reducer: {
    user: userSlice,
    shared: sharedSlice,
    chat: chatSlice,
    appState: appStateSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
