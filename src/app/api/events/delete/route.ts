import { logger } from "@lib/winston";
import { NextApiRequest } from "next";
import { verifyRequest } from "@contentful/node-apps-toolkit";
import { ServerResponse } from "@helpers/serverResponse";
import { NextRequest } from "next/server";

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
      return ServerResponse.unauthorizedError("Invalid Contentful request");
    }

    const body = request.json();

    console.log(body);
  } catch (e) {
    logger.error(e);

    console.log(e);
  }
};
