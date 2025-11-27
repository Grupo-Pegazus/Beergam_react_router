import authStore from "~/features/store-zustand";


type RestrictionSource = "socket" | "http";

export interface UsageLimitPayload {
  event_type?: string;
  message?: string;
  timestamp?: number;
  next_allowed_at?: number | null;
  weekday?: string | null;
  reason?: string | null;
}

interface EnforcementPayload extends UsageLimitPayload {
  source: RestrictionSource;
}

const ENFORCEMENT_COOLDOWN_MS = 2500;
let lastEnforcementAt = 0;
let lastSignature = "";

export function enforceUsageLimit(payload: EnforcementPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const signature = buildSignature(payload);
  if (!shouldEnforce(signature)) {
    return;
  }

  lastSignature = signature;
  lastEnforcementAt = Date.now();

  const setAuthError = authStore.getState().setAuthError;
  setAuthError("USAGE_TIME_LIMIT");

  console.log("✅ UsageLimitData setado no Zustand:", payload);

  // Para requisições HTTP 403, ainda limpa cookies
  // pois pode ser que o backend não tenha invalidado a sessão ainda
  if (payload.source === "http") {
    clearAuthCookies();
  }
}

function shouldEnforce(signature: string) {
  const elapsed = Date.now() - lastEnforcementAt;
  return elapsed > ENFORCEMENT_COOLDOWN_MS || signature !== lastSignature;
}

function buildSignature(payload: EnforcementPayload) {
  const nextWindow = payload.next_allowed_at ?? "none";
  return `${payload.source}:${payload.event_type ?? "unknown"}:${nextWindow}`;
}


function clearAuthCookies() {
  const cookieNames = ["access_token", "refresh_token"];
  const base = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : undefined;

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; ${base}`;
    if (hostname && hostname.includes(".")) {
      document.cookie = `${name}=; ${base}; domain=.${hostname}`;
    }
  });
}


