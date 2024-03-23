import { contentfulClient, connectToDatabase } from "@lib";
import { ServerResponse, getSession, mergeAttendees } from "@helpers";
import { TypeEventSkeleton } from "@types";
import { Asset } from "contentful";
import z from "zod";
import { NextRequest } from "next/server";
import { AttendeeList, User } from "@models";

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

      const attendeeList = await AttendeeList.find({
        event_id: res.sys.id,
      });

      const baseSlot = {
        available_tickets: res.fields.amountOfTickets,
        reserved: false,
        purchased: false,
        attendees: [] as string[],
      };

      let slot1: typeof baseSlot;
      let slot2: typeof baseSlot;

      const returnSlot = async (slotNum: number) => {
        const attendeeListSlotN = attendeeList.find(
          (e) => e.time_slot === slotNum,
        );

        const { session } = await getSession(request);

        return {
          available_tickets: attendeeListSlotN.available_tickets,
          reserved:
            session &&
            attendeeListSlotN.reserved_tickets.includes(session.user.userId),
          purchased:
            session &&
            attendeeListSlotN.attendees.includes(session.user.userId),
          attendees: attendeeListSlotN.attendees,
        };
      };
      if (attendeeList.length > 0) {
        slot1 = await returnSlot(1);
        slot2 = await returnSlot(2);
      } else {
        slot1 = baseSlot;
        slot2 = baseSlot;
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
        attendees:
          attendeeList.length > 0
            ? await mergeAttendees(
              attendeeList[0],
              attendeeList[1],
              res.fields.date,
              "profile instagram first_name last_name skill",
            )
            : [],
        time_slots: {
          1: slot1,
          2: slot2,
        },
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
