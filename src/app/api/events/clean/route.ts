import { NextRequest } from "next/server";
import { ServerResponse } from "@helpers";
import z from "zod";
import { AttendeeList } from "@models";
import { contentfulCMA } from "@lib";

const cleanSchema = z.object({
  event_id: z.string({ required_error: "Event is required" }),
  secret: z.string({ required_error: "Invalid secret" }),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = cleanSchema.safeParse(body);

  if (validation.success) {
    try {
      if (body.secret !== process.env.NEXT_INTERNAL_SECRET) {
        return ServerResponse.unauthorizedError("Invalid internal request");
      }

      await AttendeeList.deleteMany({
        event_id: body.event_id,
      });

      await contentfulCMA.entry.unpublish({
        entryId: body.event_id,
      });

      await contentfulCMA.entry.delete({
        entryId: body.event_id,
      });

      return ServerResponse.success("Sucessfully deleted entry");
    } catch (e) {
      console.log(e);
      return ServerResponse.serverError(e);
    }
  }
};
