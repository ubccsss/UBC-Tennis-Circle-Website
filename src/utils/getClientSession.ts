"use server";
import { auth } from "@lib/lucia";
import { connectToDatabase } from "@lib/mongoose";
import { cache } from "react";
import * as context from "next/headers";

// validates if user is authenticated. should ONLY be used on client side (and not on an api route) because request is set to null and cache function is used
export const getClientSession = cache(async () => {
  await connectToDatabase();

  const authRequest = auth.handleRequest("GET", context);

  const session = await authRequest.validate();
  return session;
});
