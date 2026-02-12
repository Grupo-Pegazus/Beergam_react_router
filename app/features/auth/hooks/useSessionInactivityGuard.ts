import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import authStore from "~/features/store-zustand";
import {
  getLastActivity,
  setLastActivity,
} from "../utils/sessionActivityStorage";

/** 8 horas em ms - força revalidação de sessão após inatividade */
const INACTIVITY_THRESHOLD_MS = 8 * 60 * 10 * 1000;

/** Intervalo de verificação: 1 minuto */
const CHECK_INTERVAL_MS = 60 * 1000;

/** Debounce de escritas no localStorage */
const ACTIVITY_DEBOUNCE_MS = 2000;

export function useSessionInactivityGuard() {
  const navigate = useNavigate();
  const lastActivityRef = useRef<number>(Date.now());
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistLastActivity = useCallback(() => {
    setLastActivity(lastActivityRef.current);
  }, []);

  const updateLastActivity = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      persistLastActivity();
      debounceTimerRef.current = null;
    }, ACTIVITY_DEBOUNCE_MS);
  }, [persistLastActivity]);

  const checkInactivityAndRedirect = useCallback(() => {
    if (!authStore.getState().user) return;

    const now = Date.now();
    const elapsed = now - lastActivityRef.current;

    if (elapsed >= INACTIVITY_THRESHOLD_MS) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      navigate("/login", { replace: true });
    } else {
      persistLastActivity();
    }
  }, [navigate, persistLastActivity]);

  useEffect(() => {
    if (!authStore.getState().user) return;

    const storedTime = getLastActivity();

    if (storedTime !== null) {
      const elapsed = Date.now() - storedTime;
      if (elapsed >= INACTIVITY_THRESHOLD_MS) {
        navigate("/login", { replace: true });
        return;
      }
      lastActivityRef.current = storedTime;
    } else {
      lastActivityRef.current = Date.now();
      persistLastActivity();
    }

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    const intervalId = setInterval(
      checkInactivityAndRedirect,
      CHECK_INTERVAL_MS
    );

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });
      clearInterval(intervalId);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [updateLastActivity, checkInactivityAndRedirect, navigate, persistLastActivity]);
}
