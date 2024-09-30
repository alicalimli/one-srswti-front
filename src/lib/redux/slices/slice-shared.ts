import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SharedInitialState {
  error: any | null;
  sharedLoading: boolean;
  sharedRequest: string[];
}

const INITIAL_STATE: SharedInitialState = {
  error: null,
  sharedRequest: [],
  sharedLoading: false,
};

const sharedSlice = createSlice({
  name: "shared",
  initialState: INITIAL_STATE,
  reducers: {
    setSharedRequest: (state, action: PayloadAction<string>) => {
      state.sharedRequest.push(action.payload);
      state.sharedLoading = true;
    },
    removeSharedRequest: (state, action: PayloadAction<string>) => {
      state.sharedRequest = state.sharedRequest.filter(
        (request) => request !== action.payload
      );
      state.sharedLoading = state.sharedRequest.length > 0;
    },
    setSharedError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSharedRequest, removeSharedRequest, setSharedError } =
  sharedSlice.actions;

export const getSharedState = (state: RootState) => state.shared;

export default sharedSlice.reducer;
