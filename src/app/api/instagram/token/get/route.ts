import { connectToDatabase, logger } from "@lib";
import { ServerResponse } from "@helpers";
import { NextRequest } from "next/server";
import { InstagramToken } from "@models";
import z from "zod";

const refreshTokenSchema = z.object({
  refresh_token: z.string({ required_error: "Refresh Token is required" }),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const { refresh_token } = await request.json();

  const validation = refreshTokenSchema.safeParse({ refresh_token });

  if (validation.success) {
    try {
      if (refresh_token !== process.env.NEXT_INSTAGRAM_REFRESH_TOKEN) {
        return ServerResponse.userError("Invalid Refresh Token");
      }

      const { token } = await InstagramToken.findOne().lean();

      return ServerResponse.success({ token });
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
