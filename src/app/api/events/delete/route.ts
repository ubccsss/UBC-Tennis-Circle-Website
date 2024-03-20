import { NextRequest } from "next/server";
import { verifyRequest } from "@contentful/node-apps-toolkit";
import { logger } from "@lib/winston";
import { ServerResponse } from "@helpers/serverResponse";

export const POST = async (request: NextRequest) => {
  const contentfulRequest = {
    method: request.method as "POST",
    path: request.url,
  };

  try {
    const isValid = verifyRequest(
      process.env.NEXT_CONTENTFUL_SECRET,
      contentfulRequest,
    );

    if (!isValid) {
      return ServerResponse.unauthorizedError();
    }

    const body = request.json();
    console.log(body);
    return ServerResponse.success("success");
  } catch (e) {
    logger.error(e);
    console.log(e);
    return ServerResponse.serverError();
  }
};
