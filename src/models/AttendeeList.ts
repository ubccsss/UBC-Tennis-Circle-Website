import mongoose, { Schema } from "mongoose";

export interface TicketReservation {
  user_id: string;
  expires: string;
}

export interface AttendeeList {
  _id: string;
  event_id: string;
  available_tickets: number;
  initial_tickets: number;
  reserved_tickets: Array<TicketReservation>;
}

mongoose.Promise = global.Promise;

const schema = new Schema<AttendeeList>({
  event_id: { type: String, required: true },
  available_tickets: { type: Number, required: true },
  initial_tickets: { type: Number, requried: true },
  reserved_tickets: {
    type: [
      {
        user_id: String,
        expires: String,
      },
    ],
    default: [],
    requried: true,
  },
});

export const AttendeeList =
  (mongoose.models.AttendeeList as mongoose.Model<AttendeeList>) ||
  mongoose.model<AttendeeList>("AttendeeList", schema);
