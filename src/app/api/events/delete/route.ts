import { NextRequest } from "next/server";
import { ServerResponse } from "@helpers/serverResponse";
import z from "zod";
import { AttendeeList, User } from "@models";
import { sendMail, mergent, stripe, logger } from "@lib";
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

      const attendeeLists = await AttendeeList.find({
        event_id: body.event_id,
      }).lean<AttendeeList[]>();

      const deleted = await AttendeeList.deleteMany({
        event_id: body.event_id,
      });

      if (deleted.deletedCount === 0) {
        return ServerResponse.success("No Attendee List Found");
      }

      try {
        // remove tasks when event is deleted
        await mergent.tasks.delete(attendeeLists[0].tasks.close);
        await mergent.tasks.delete(attendeeLists[0].tasks.clean);
      } catch (e) {
        logger.info(e);
      }

      const userIdList = [
        ...new Set(attendeeLists.flatMap((i) => i.attendees)),
      ];

      const payments = attendeeLists.flatMap((i) => i.payments);

      payments.map(async (i) => {
        await stripe.refunds.create({ payment_intent: i });
      });

      const emailList: Array<{ _id: string; email_address: string }> =
        await User.find({
          _id: {
            $in: userIdList,
          },
        })
          .select("email_address")
          .lean();

      await sendMail({
        to: emailList.map((i) => i.email_address),
        subject: `Cancellation of ${attendeeLists[0].event_name}`,
        emailComponent: DeleteEmail({
          event_name: attendeeLists[0].event_name,
        }),
      });

      return ServerResponse.success({ emails_sent: emailList });
    } catch (e) {
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
