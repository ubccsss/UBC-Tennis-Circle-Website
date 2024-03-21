import mongoose, { Schema } from "mongoose";

export interface TicketReservation {
  user_id: string;
  expires: string;
}

export type UserId = string;

export interface AttendeeList {
  _id: string;
  event_id: string;
  event_name: string;
  ticket_price: number;
  available_tickets: number;
  reserved_tickets: Array<TicketReservation>;
  attendees: Array<UserId>;
}

mongoose.Promise = global.Promise;

const schema = new Schema<AttendeeList>({
  event_id: { type: String, required: true },
  event_name: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  available_tickets: { type: Number, required: true },
  reserved_tickets: {
    type: [
      {
        user_id: String,
        expires: String,
      },
    ],
    default: [],
  },
  // list of user_ids
  attendees: [{ type: String, required: true }],
});

export const AttendeeList =
  (mongoose.models.AttendeeList as mongoose.Model<AttendeeList>) ||
  mongoose.model<AttendeeList>("AttendeeList", schema);
