import { createCookieSessionStorage } from "react-router";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "JWT",
      secrets: ["aaaa"],
      secure: true,
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      domain: "localhost",
    },
  });
