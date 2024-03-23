import { contentfulClient } from "@lib";
import { ServerResponse } from "@helpers";
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
        const attendeeList = await AttendeeList.findOne({
          event_id: i.sys.id,
        }).select("attendees");

        const profiles = await User.find({
          _id: { $in: attendeeList.attendees },
        }).select("profile first_name last_name");

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
          attendees: profiles.map((j) => ({
            profile: j.profile,
            name: `${j.first_name} ${j.last_name}`,
          })),
        };
      }),
    );

    return ServerResponse.success(events);
  } catch (e) {
    return ServerResponse.serverError();
  }
};
