import { stripe, connectToDatabase } from "@lib";
import axios, { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import z from "zod";
import { getSession, ServerResponse } from "@helpers";
import { TennisEvent } from "@types";
import { logger, mergent } from "@lib";
import { AttendeeList } from "@models";
import { addMinutes, getUnixTime } from "date-fns";
import { rangeHours } from "@utils/time";

const purchaseSchema = z.object({
  event_id: z.string({ required_error: "Event token is required" }),
  time_slot: z.union([z.literal(1), z.literal(2)]),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const { event_id, time_slot } = await request.json();

  const validation = purchaseSchema.safeParse({ event_id, time_slot });

  const { session } = await getSession(request);

  const eventURLPath = `/events/detail/${event_id}`;

  if (!session) {
    return ServerResponse.success({
      url: `${process.env.NEXT_PUBLIC_HOSTNAME}/login?redirect=${eventURLPath}`,
    });
  }

  if (validation.success) {
    try {
      const event: AxiosResponse<TennisEvent> = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
        {
          id: event_id,
        },
      );

      const attendeeList = await AttendeeList.findOne({
        event_id: event.data.id,
        time_slot,
        status: "open",
      });

      if (!attendeeList) {
        return ServerResponse.userError("Event is closed or does not exist");
      }

      if (attendeeList.attendees.includes(session.user.userId)) {
        return ServerResponse.success({
          url: `${process.env.NEXT_PUBLIC_HOSTNAME}${eventURLPath}?purchased=true`,
        });
      }

      if (!attendeeList.reserved_tickets.includes(session.user.userId)) {
        if (attendeeList.available_tickets <= 0) {
          return ServerResponse.success({
            url: `${process.env.NEXT_PUBLIC_HOSTNAME}${eventURLPath}?sold-out=true`,
          });
        } else {
          await AttendeeList.findOneAndUpdate(
            {
              event_id: event.data.id,
              time_slot,
            },
            {
              $push: {
                reserved_tickets: session.user.userId,
              },
              $inc: { available_tickets: -1 },
            },
          );

          const mergentTask = await mergent.tasks.create({
            request: {
              url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/ticket/expire-reservation`,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reservation_secret: process.env.NEXT_RESERVATION_SECRET,
                event_id: event.data.id,
                user_id: session.user.userId,
                time_slot,
              }),
            },
            scheduledFor: addMinutes(new Date(), 30),
          });

          await AttendeeList.findOneAndUpdate(
            {
              event_id: event.data.id,
              time_slot,
            },
            {
              $push: {
                reservation_expire_tasks: {
                  user_id: session.user.userId,
                  task_id: mergentTask.id,
                },
              },
            },
          );
        }
      } else {
        const dBexistingTask = attendeeList.reservation_expire_tasks.find(
          (e) => e.user_id === session.user.userId,
        );

        const task = await mergent.tasks.retrieve(dBexistingTask.task_id);

        if (task.status === "queued") {
          await mergent.tasks.update(dBexistingTask.task_id, {
            scheduledFor: addMinutes(new Date(), 30),
          });
        }
      }

      const expires = getUnixTime(addMinutes(new Date(), 30));

      const stripeSession = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              unit_amount: event.data.ticket_price * 100,
              currency: "cad",
              product_data: {
                name: `${event.data.name} Ticket (${rangeHours(
                  event.data.date,
                  1,
                  time_slot === 2 ? 1 : 0,
                )})`,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          event_id: event.data.id,
          user_id: session.user.userId,
          time_slot,
        },
        success_url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/ticket/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_HOSTNAME}/events/detail/${event_id}`,
        automatic_tax: { enabled: true },
        expires_at: expires,
      });

      return ServerResponse.success({ url: stripeSession.url });
    } catch (e) {
      console.log(e);
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
