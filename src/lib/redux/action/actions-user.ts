import { Dispatch } from "@reduxjs/toolkit";
import { removeSharedRequest, setSharedRequest } from "../slices/slice-shared";
import {
  initialUserState,
  setUserReducerState,
  UserReducerStateType,
} from "../slices/user";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { ProfileType } from "@/lib/types";
import { supabase } from "@/lib/supabase/supabase";
import { SubscriptionDataType, SUBSCRIPTIONS } from "@/lib/config";

export const getUserProfile = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("GET_USER_PROFILE"));
  try {
    // const response = await fetch("/api/user-profile");
    // const responseJSON = await response.json();

    // if (responseJSON?.error) {
    //   throw new Error(responseJSON.error);
    // }

    dispatch(setUserReducerState({ profile: {} }));
  } catch (error) {
    console.error("Error fetching user profile:", error);
  } finally {
    dispatch(removeSharedRequest("GET_USER_PROFILE"));
  }
};

export const updateUserProfile =
  (profileData: Partial<ProfileType>) => async (dispatch: Dispatch) => {
    dispatch(setSharedRequest("UPDATE_USER_PROFILE"));
    try {
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const responseJSON = await response.json();

      if (responseJSON.error) {
        throw new Error(responseJSON.error);
      }

      // Fetch the updated profile
      dispatch(getUserProfile());
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(error.message);
    } finally {
      dispatch(removeSharedRequest("UPDATE_USER_PROFILE"));
    }
  };

const getSubscriptionData = async (user_id: string) => {
  let userData;

  try {
    const { data: user } = await supabase
      .from("one_srswti_users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    userData = user;

    if (!userData?.customer_id) {
      throw new Error("No Customer Data");
    }

    const { data: subscriptionData, error } = await supabase
      .from("one_srswti_subscriptions")
      .select()
      .eq("customer_id", userData?.customer_id)
      .single();

    if (error) {
      throw error;
    }

    const endDate = new Date(subscriptionData.end_date);
    const startDate = new Date(subscriptionData.start_date);

    const isEntitledToSubsTier = endDate > startDate;
    const subscriptionTierData =
      SUBSCRIPTIONS[
        isEntitledToSubsTier ? subscriptionData.product_id : "free"
      ];

    return {
      customer_id: user.customer_id,
      data: subscriptionTierData as SubscriptionDataType,
      is_cancelled: subscriptionData.subscription_data?.cancel_at,
      is_subscribed: subscriptionTierData.tier !== "free",
    };
  } catch (e) {
    console.log(e);
    return {
      customer_id: null,
      data: SUBSCRIPTIONS["free"],
    };
  }
};

export const getUser = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("GET_USER"));

  try {
    let user: User | null = null;

    const { data: firstGetResponse, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    const firstUserResponse = firstGetResponse?.user;
    const shouldInitializeUserData =
      !firstGetResponse?.user?.user_metadata?.username;

    if (firstUserResponse && shouldInitializeUserData) {
      // generate username
      const username =
        firstUserResponse?.email?.split("@")[0] ||
        "user" + Math.floor(Math.random() * 10000);

      supabase.auth.updateUser({ data: { username } });

      const { data: res, error } = await supabase.auth.getUser();

      await supabase
        .from("one_srswti_users")
        .insert({ user_id: firstUserResponse.id });
      user = res.user;
    } else {
      user = firstGetResponse.user;
    }
    const subData = await getSubscriptionData(firstGetResponse.user.id);

    const data: Partial<UserReducerStateType> = {
      user,
      isAnonymous: false,
      nyuStudent: user?.email?.includes("nyu.edu"),
      subscription: {
        ...subData,
      },
    };

    await dispatch(getUserProfile());

    dispatch(setUserReducerState(data));
  } catch (error) {
    dispatch(setUserReducerState({ isAnonymous: true }));
    console.log(error);
  } finally {
    dispatch(removeSharedRequest("GET_USER"));
  }
};

export const supabaseSignIn =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch: Dispatch) => {
    dispatch(setSharedRequest("SUPABASE_SIGN_IN"));
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(removeSharedRequest("SUPABASE_SIGN_IN"));
    }
  };

export const googleSignIn = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("GOOGLE_SIGN_IN"));
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(removeSharedRequest("GOOGLE_SIGN_IN"));
  }
};

export const signOut = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setSharedRequest("SIGN_OUT"));

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    dispatch(setUserReducerState({ ...initialUserState, isAnonymous: true }));
  } catch (error) {
    toast.error(error.message);
  } finally {
    dispatch(removeSharedRequest("SIGN_OUT"));
  }
};

const exampleMessages = [
  "What is GPT-4o mini?",
  "Why is Nvidia growing rapidly?",
  "How does the Vercel AI SDK work?",
  "Tesla vs Rivian",
];

export const reduxGetPersonalizedQueries = () => async (dispatch: Dispatch) => {
  dispatch(setSharedRequest("GET_PERSONALIZED_QUERIES"));
  try {
    const response = await fetch("/api/generate-personalized-queries");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (Array.isArray(data.queries)) {
      dispatch(setUserReducerState({ personalizedQueries: data.queries }));
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    dispatch(setUserReducerState({ personalizedQueries: exampleMessages }));

    console.error("Error fetching personalized queries:", error);
  } finally {
    dispatch(removeSharedRequest("GET_PERSONALIZED_QUERIES"));
  }
};
