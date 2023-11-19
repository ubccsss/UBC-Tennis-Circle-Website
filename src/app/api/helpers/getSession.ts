import { auth } from "@lib/lucia";
import * as context from "next/headers";
import { NextRequest } from "next/server";

export const getSession = async (req: NextRequest) => {
  const authRequest = auth.handleRequest(req.method, context);
  const session = await authRequest.validate();
  return session;
};
