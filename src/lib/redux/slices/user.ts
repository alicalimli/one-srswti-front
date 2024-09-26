import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { RootState } from "../store";
import { ProfileType } from "@/lib/types";
import { SubscriptionDataType } from "@/lib/config";

export interface UserReducerStateType {
  user: User | null;
  personalizedQueries: string[];
  nyuStudent: boolean;
  loading: boolean;
  profile: ProfileType | null;
  error: string | null;
  isAnonymous: boolean | null;
  subscription: {
    data: SubscriptionDataType;
    is_cancelled?: string;
    customer_id?: string;
    is_subscribed?: boolean;
  } | null;
}

export const initialUserState: UserReducerStateType = {
  user: null,
  nyuStudent: false,
  personalizedQueries: [],
  profile: null,
  loading: false,
  error: null,
  isAnonymous: null,
  subscription: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserReducerState: (
      state,
      action: PayloadAction<Partial<UserReducerStateType>>
    ) => {
      return { ...state, ...action.payload };
    },
    setUserState: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUserReducerState, setUserState } = userSlice.actions;

export const getUserState = (state: RootState) => state.user;

export default userSlice.reducer;
