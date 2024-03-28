import { NextRequest } from "next/server";
import { ServerResponse } from "@helpers";
import z from "zod";
import { AttendeeList } from "@models";
import axios from "axios";
import { logger, mergent } from "@lib";
import { addHours, subDays } from "date-fns";

const createSchema = z.object({
  event_id: z.string({ required_error: "Event is required" }),
  secret: z.string({ required_error: "Invalid webhook secret" }),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = createSchema.safeParse(body);

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

      const res = event.data;

      const existingList = await AttendeeList.updateMany(
        { event_id: res.id },
        { event_name: res.name, ticket_price: res.ticket_price }, // name and ticket price of the event could change
      );

      if (existingList.modifiedCount !== 0) {
        return ServerResponse.success(existingList);
      }

      const closeTask = await mergent.tasks.create({
        request: {
          url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/close`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.NEXT_INTERNAL_SECRET,
            event_id: event.data.id,
          }),
        },
        // status: close on event 2 days before the event starts
        scheduledFor: subDays(new Date(res.date), 2),
      });

      const cleanTask = await mergent.tasks.create({
        request: {
          url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/clean`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.NEXT_INTERNAL_SECRET,
            event_id: event.data.id,
          }),
        },
        // remove event from db 2 hours after event starts
        scheduledFor: addHours(new Date(res.date), 2),
      });

      const genAttendeeList = (slot: number) => ({
        event_id: res.id,
        event_name: res.name,
        ticket_price: res.ticket_price,
        status: "open",
        tasks: {
          close: closeTask.id,
          clean: cleanTask.id,
        },
        // available tickets for first and second will be the same on initialization
        available_tickets: res.time_slots[1].available_tickets,
        time_slot: slot,
        reserved_tickets: [],
        attendees: [],
        reservation_expire_tasks: [],
      });

      const attendeeList = await AttendeeList.create([
        genAttendeeList(1),
        genAttendeeList(2),
      ]);

      return ServerResponse.success(attendeeList);
    } catch (e) {
      console.log(e);
      logger.error(e);
      return ServerResponse.serverError(e);
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
