import { NextRequest } from "next/server";
import { logger } from "@lib/winston";
import { ServerResponse } from "@helpers/serverResponse";
import z from "zod";
import { AttendeeList, User } from "@models";
import axios from "axios";
import { resend, sendMail } from "@lib";
import DeleteEmail from "@emails/DeleteEventEmail";

const deleteSchema = z.object({
  event_id: z.string({ required_error: "Event is required" }),
  secret: z.string({ required_error: "Invalid webhook secret" }),
});
export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = deleteSchema.safeParse(body);

  if (validation.success) {
    try {
      if (body.secret !== process.env.NEXT_CONTENTFUL_SECRET) {
        return ServerResponse.unauthorizedError("Invalid contentful request");
      }

      const event = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
        {
          id: body.event_id,
        },
      );

      const eventName = event.data.name;

      const attendeeList = await AttendeeList.findOne({
        event_id: body.event_id,
      }).lean();

      const emailList: string[] = await User.find({
        _id: attendeeList.attendees,
      })
        .select("email_address")
        .lean();

      await sendMail({
        to: emailList,
        subject: `Cancellation of ${eventName}`,
        emailComponent: DeleteEmail({
          event_name: eventName,
        }),
      });

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
