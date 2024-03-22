import { connectToDatabase, stripe, logger, mergent } from "@lib";
import { NextRequest, NextResponse } from "next/server";
import { AttendeeList } from "@models/AttendeeList";

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  const sessionId = request.nextUrl.searchParams.get("session_id");

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (
    session &&
    session.status === "complete" &&
    session.payment_status === "paid"
  ) {
    const { event_id, user_id } = session.metadata;

    const attendeeList = await AttendeeList.findOne({
      event_id,
    });

    // standard case where user is in reserved,
    // if the user is reserved, it means that the mergent task
    // has not processed yet
    if (attendeeList.reserved_tickets.includes(user_id)) {
      const task = attendeeList.reservation_expire_tasks.find(
        (e) => e.user_id === user_id,
      );

      await mergent.tasks.delete(task.task_id);

      await AttendeeList.findOneAndUpdate(
        {
          event_id,
        },
        {
          $pull: {
            reserved_tickets: user_id,
            reservation_expire_tasks: { user_id },
          },
          $push: {
            attendees: user_id,
          },
        },
      );

      return NextResponse.redirect(
        new URL(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/events/detail/${event_id}?successful_payment=true`,
        ),
      );
    } else {
      // mergent task could theoretically occur right after payment but right before
      // success api route is called meaning that user is not reserved but has paid

      // in the case where the event still has space

      if (attendeeList.available_tickets >= 1) {
        await AttendeeList.findOneAndUpdate(
          { event_id },
          {
            $push: {
              attendees: user_id,
            },
            $inc: { available_tickets: -1 },
          },
        );

        return NextResponse.redirect(
          new URL(
            `${process.env.NEXT_PUBLIC_HOSTNAME}/events/detail/${event_id}?successful-payment=true`,
          ),
        );
      } else {
        // worst edge case where user pays for last ticket at last possible second before session closes,
        // it gets unreserved as the user takes too long, and someone else buys before their payment gets processed
        const refund = await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
        });

        logger.info(refund);

        return NextResponse.redirect(
          new URL(
            `${process.env.NEXT_PUBLIC_HOSTNAME}/events/detail/${event_id}?unsuccessful-payment=true`,
          ),
        );
      }
    }
  }

  return NextResponse.redirect(
    new URL(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/events?unsuccessful-payment=true`,
    ),
  );
};
