import type { Subscription } from "../user/typings/BaseUser";

export type TSubscriptionError =
  | "SUBSCRIPTION_NOT_FOUND"
  | "SUBSCRIPTION_NOT_ACTIVE"
  | "SUBSCRIPTION_CANCELLED";

export type TAuthError =
  | "REFRESH_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_REVOKED"
  | "USAGE_TIME_LIMIT"
  | TSubscriptionError
  | "UNKNOWN_ERROR";

export interface UsageLimitData {
  message?: string;
  next_allowed_at?: number | null;
  weekday?: string | null;
  reason?: string | null;
}

export interface IAuthState {
  loading: boolean;
  subscription: Subscription | null;
  error: TAuthError | null;
  success: boolean;
  usageLimitData?: UsageLimitData | null;
}

