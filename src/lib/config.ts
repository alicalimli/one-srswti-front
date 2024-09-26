export const SUPABASE_KEY = import.meta.env.VITE_APP_SB_KEY;
export const SUPABASE_URL = import.meta.env.VITE_APP_SB_URL;

export const SUBSCRIPTIONS = {
  prod_QszYxKauDLWIQO: {
    name: "SRSWTI ONE PREMIUM",
    tier: "premium",
    id: "srswti-one-premium",
    productID: "prod_QszYxKauDLWIQO",
  },
  free: {
    name: "SRSWTI ONE FREE",
    tier: "free",
    id: "srswti-one-free",
    productID: "free",
  },
};

export type SubscriptionDataType =
  (typeof SUBSCRIPTIONS)[keyof typeof SUBSCRIPTIONS];
