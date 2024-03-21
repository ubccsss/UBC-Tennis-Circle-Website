import { NextRequest } from "next/server";
import { ServerResponse } from "@helpers";
import z from "zod";
import { AttendeeList } from "@models";
import axios from "axios";
import { logger } from "@lib";

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

      const existingList = await AttendeeList.findOneAndUpdate(
        { event_id: res.id },
        { event_name: res.name, ticket_price: res.ticket_price }, // name and ticket price of the event could change
      );

      if (existingList) {
        return ServerResponse.success(existingList);
      }

      const attendeeList = await AttendeeList.create({
        event_id: res.id,
        event_name: res.name,
        ticket_price: res.ticket_price,
        available_tickets: res.initial_tickets,
        reserved_tickets: [],
        attendees: [],
      });

      return ServerResponse.success(attendeeList);
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError(e);
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
