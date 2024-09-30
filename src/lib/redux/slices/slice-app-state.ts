import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LLMModeId } from "@/lib/data/dataModes";

export interface AppStateReducerType {
  hoveredMode: string | null;
  activeMode: LLMModeId;
  loading: boolean;
  isGenerating: boolean;
  showBilling: boolean;
  error: string | null;
  focusMode: boolean;
}

export const initialAppState: AppStateReducerType = {
  hoveredMode: null,
  activeMode: "web",
  loading: false,
  error: null,
  showBilling: false,
  isGenerating: false,
  focusMode: false,
};

const appStateSlice = createSlice({
  name: "appState",
  initialState: initialAppState,
  reducers: {
    setAppStateReducer: (
      state,
      action: PayloadAction<Partial<AppStateReducerType>>
    ) => {
      return { ...state, ...action.payload };
    },
    setHoveredMode: (state, action: PayloadAction<string | null>) => {
      state.hoveredMode = action.payload;
    },
    setActiveMode: (state, action: PayloadAction<LLMModeId>) => {
      state.activeMode = action.payload;
    },
  },
});

export const { setAppStateReducer, setHoveredMode, setActiveMode } =
  appStateSlice.actions;

export const getReducerAppState = (state: RootState) => state.appState;

export default appStateSlice.reducer;
