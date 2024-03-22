import { contentfulClient, connectToDatabase } from "@lib";
import { ServerResponse, getSession } from "@helpers";
import { TypeEventSkeleton } from "@types";
import { Asset } from "contentful";
import z from "zod";
import { NextRequest } from "next/server";
import { AttendeeList } from "@models";

const detailSchema = z.object({
  id: z.string({ required_error: "Event ID is required" }),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const { id } = await request.json();

    const validation = detailSchema.safeParse({ id });

    if (validation.success) {
      const res = await contentfulClient.getEntry<TypeEventSkeleton>(id);

      if (res.fields.openingStatus === "Coming Soon") {
        return ServerResponse.userError("Invalid event ID");
      }

      const attendeeList = await AttendeeList.findOne({
        event_id: res.sys.id,
      });

      let availableTickets = res.fields.amountOfTickets;

      if (attendeeList) {
        availableTickets = attendeeList?.available_tickets;
      }

      let reserved = false;
      let purchased = false;

      const { session } = await getSession(request);

      if (session && attendeeList) {
        if (
          attendeeList.reservation_expire_tasks.find(
            (e) => e.user_id === session.user.userId,
          )
        ) {
          reserved = true;
        }

        if (attendeeList.attendees.includes(session.user.userId)) {
          purchased = true;
        }
      }

      const event = {
        id: res.sys.id,
        name: res.fields.name,
        location: res.fields.location,
        ticket_price: res.fields.ticketPrice,
        date: res.fields.date,
        cover_image: `https:${(res.fields.coverImage as Asset)?.fields?.file
          ?.url}`,
        description: res.fields.description,
        available_tickets: availableTickets,
        reserved,
        purchased,
      };

      return ServerResponse.success(event);
    } else {
      return ServerResponse.userError("Invalid event ID");
    }
  } catch (e) {
    console.log(e);
    return ServerResponse.userError("Event not found");
  }
};
