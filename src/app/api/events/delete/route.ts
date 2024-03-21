import { NextRequest } from "next/server";
import { logger } from "@lib/winston";
import { ServerResponse } from "@helpers/serverResponse";
import z from "zod";
import { AttendeeList, User } from "@models";
import { sendMail } from "@lib";
import { DeleteEmail } from "@emails";

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

      const attendeeList = await AttendeeList.findOneAndDelete({
        event_id: body.event_id,
      }).lean();

      if (!attendeeList) {
        return ServerResponse.success("No Attendee List Found");
      }

      const emailList: Array<{ _id: string; email_address: string }> =
        await User.find({
          _id: attendeeList.attendees,
        })
          .select("email_address")
          .lean();

      await sendMail({
        to: emailList.map((i) => i.email_address),
        subject: `Cancellation of ${attendeeList.event_name}`,
        emailComponent: DeleteEmail({
          event_name: attendeeList.event_name,
        }),
      });

      return ServerResponse.success({ emails_sent: emailList });
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
