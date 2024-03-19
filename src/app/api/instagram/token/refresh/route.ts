import axios from "axios";
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

      const existingToken = await InstagramToken.findOne({}).lean();

      const params = {
        grant_type: "ig_refresh_token",
        access_token: existingToken.token,
      };

      const res = await axios.get<{ access_token: string; expires_in: string }>(
        "https://graph.instagram.com/refresh_access_token",
        { params },
      );

      await InstagramToken.findByIdAndUpdate(existingToken._id, {
        token: res.data.access_token,
        expires: res.data.expires_in,
      });

      return ServerResponse.success("Successfully refreshed token");
    } catch (e) {
      logger.error(e);
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
