import { createCookieSessionStorage, } from "react-router";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "user-info",
      secrets: ["aaaa"],
    },
  });
