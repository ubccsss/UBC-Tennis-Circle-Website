import { contentfulClient } from "@lib";
import { ServerResponse, mergeAttendees } from "@helpers";
import { TypeEventSkeleton } from "@types";
import { Asset } from "contentful";
import { AttendeeList, User } from "@models";

export const GET = async () => {
  try {
    const res = await contentfulClient.getEntries<TypeEventSkeleton>({
      content_type: "event",
      include: 2,
      order: ["-fields.openingStatus", "fields.date"],
    });

    const events = await Promise.all(
      res.items.map(async (i) => {
        const attendeeList = await AttendeeList.find({
          event_id: i.sys.id,
        }).select("attendees");

        const attendees =
          attendeeList.length > 0
            ? await mergeAttendees(
              attendeeList[0],
              attendeeList[1],
              i.fields.date,
              "profile first_name last_name",
            )
            : [];

        return {
          id: i.sys.id,
          name: i.fields.name,
          location: i.fields.location,
          ticket_price: i.fields.ticketPrice,
          date: i.fields.date,
          cover_image: `https:${(i.fields.coverImage as Asset)?.fields?.file
            ?.url}`,
          description: i.fields.description,
          opening_status: i.fields.openingStatus,
          attendees,
        };
      }),
    );

    return ServerResponse.success(events);
  } catch (e) {
    console.log(e);
    return ServerResponse.serverError();
  }
};
