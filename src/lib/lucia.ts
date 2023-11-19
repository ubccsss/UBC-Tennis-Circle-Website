import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { mongoose } from "@lucia-auth/adapter-mongoose";
import { User, Key, Session } from "@models";

export const auth = lucia({
  adapter: mongoose({
    User,
    Key,
    Session,
  }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },

  getUserAttributes: (data) => {
    return {
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      email_verified: data.email_verified,
    };
  },
});

export type Auth = typeof auth;
