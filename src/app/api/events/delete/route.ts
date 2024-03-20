import { NextRequest } from "next/server";
import { logger } from "@lib/winston";
import { ServerResponse } from "@helpers/serverResponse";
import z from "zod";

const DeleteSchema = z.object({
  event_id: z.string({ required_error: "Event is required" }),
  secret: z.string({ required_error: "Invalid webhook secret" }),
});
export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = DeleteSchema.safeParse(body);

  if (validation.success) {
    try {
      if (body.secret !== process.env.NEXT_CONTENTFUL_SECRET) {
        return ServerResponse.unauthorizedError("Invalid contentful request");
      }

      return ServerResponse.success("success");
    } catch (e) {
      logger.error(e);
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
