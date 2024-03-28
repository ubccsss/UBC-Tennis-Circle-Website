import { NextRequest } from "next/server";
import { ServerResponse } from "@helpers";
import z from "zod";
import { AttendeeList } from "@models";
import axios from "axios";
import { InternalEventUser, TennisEvent } from "@types";
import { batchMail } from "@lib";
import { ReminderEmail } from "@emails";
import { format } from "date-fns";

const closeSchema = z.object({
  event_id: z.string({ required_error: "Event is required" }),
  secret: z.string({ required_error: "Invalid secret" }),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = closeSchema.safeParse(body);

  if (validation.success) {
    try {
      if (body.secret !== process.env.NEXT_INTERNAL_SECRET) {
        return ServerResponse.unauthorizedError("Invalid internal request");
      }

      const event = await axios.post<TennisEvent>(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
        {
          id: body.event_id,
          internal_key: process.env.NEXT_INTERNAL_SECRET,
        },
      );

      const res = event.data;

      const modified = await AttendeeList.updateMany(
        { event_id: res.id, status: "open" },
        { status: "closed" },
      );

      if (!modified.acknowledged) {
        return ServerResponse.serverError("No event to close found");
      }

      const batchMailArr = res.attendees.map((i: InternalEventUser) => ({
        to: i.email_address,
        subject: `Reminder: ${res.name} is happening on ${format(
          res.date,
          "MMM do",
        )}`,
        emailComponent: ReminderEmail({
          user: i,
          event: res,
        }),
      }));

      const batch = await batchMail({
        emailArray: batchMailArr,
      });

      console.log(batch);

      return ServerResponse.success("Successfully closed event");
    } catch (e) {
      console.log(e);
      return ServerResponse.serverError(e);
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
