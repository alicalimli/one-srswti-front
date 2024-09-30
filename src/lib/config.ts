export const SUPABASE_KEY = import.meta.env.VITE_APP_SB_KEY;
export const SUPABASE_URL = import.meta.env.VITE_APP_SB_URL;

export const BASE_API_URL = import.meta.env.VITE_APP_BASE_API_URL;
export const LLM_INFERENCE = `${BASE_API_URL}/ram/rinf`;
export const SRSWTI_INFERENCE = `${BASE_API_URL}/notlikeus/ncomp`;
export const SRSWTI_INFERENCE_NO_BS = `${BASE_API_URL}/notlikeus/wncomp`;

export const AES_KEY = import.meta.env.VITE_APP_AES_KEY;
export const AES_IV = import.meta.env.VITE_APP_AES_IV;
export const DUCKDUCKGO_API_URL = import.meta.env.VITE_APP_DUCKDUCKGO_API_URL;

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
