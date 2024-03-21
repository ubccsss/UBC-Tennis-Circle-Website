import { contentfulClient } from "@lib";
import { ServerResponse } from "@helpers";
import { TypeEventSkeleton } from "@types";
import { Asset } from "contentful";
import z from "zod";
import { NextRequest } from "next/server";

const detailSchema = z.object({
  id: z.string({ required_error: "Event ID is required" }),
});

export const POST = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    const validation = detailSchema.safeParse({ id });

    if (validation.success) {
      const res = await contentfulClient.getEntry<TypeEventSkeleton>(id);

      if (res.fields.openingStatus === "Coming Soon") {
        return ServerResponse.userError("Invalid event ID");
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
        initial_tickets: res.fields.amountOfTickets,
      };

      return ServerResponse.success(event);
    } else {
      return ServerResponse.userError("Invalid event ID");
    }
  } catch (e) {
    return ServerResponse.userError("Event not found");
  }
};
