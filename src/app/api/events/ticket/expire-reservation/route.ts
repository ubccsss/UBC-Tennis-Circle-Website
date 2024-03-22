import { connectToDatabase, logger } from "@lib";
import { NextRequest } from "next/server";
import z from "zod";
import { ServerResponse } from "@helpers";
import { AttendeeList } from "@models/AttendeeList";

const expireReservationSchema = z.object({
  reservation_secret: z.string({
    required_error: "Reservation secret is required",
  }),
  event_id: z.string({ required_error: "Event ID is required" }),
  user_id: z.string({ required_error: "User ID to expire is required" }),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const validation = expireReservationSchema.safeParse(body);

  try {
    if (validation.success) {
      if (body.reservation_secret !== process.env.NEXT_RESERVATION_SECRET) {
        return ServerResponse.userError("Invalid reservation secret");
      }

      const attendeeList = await AttendeeList.findOneAndUpdate(
        {
          event_id: body.event_id,
          reserved_tickets: { $in: [body.user_id] },
        },
        {
          $pull: {
            reserved_tickets: body.user_id,
            reservation_expire_tasks: { user_id: body.user_id },
          },
          $inc: { available_tickets: 1 },
        },
      );

      if (!attendeeList) {
        return ServerResponse.success("No user to expire");
      }

      return ServerResponse.success("Expired user");
    } else {
      return ServerResponse.userError("Invalid schema");
    }
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError(e);
  }
};
