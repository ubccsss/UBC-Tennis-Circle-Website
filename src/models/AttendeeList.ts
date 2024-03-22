import mongoose, { Schema } from "mongoose";

export type UserId = string;

export interface AttendeeList {
  _id: string;
  event_id: string;
  event_name: string;
  ticket_price: number;
  available_tickets: number;
  reserved_tickets: Array<string>;
  attendees: Array<UserId>;
  reservation_expire_tasks: Array<{
    user_id: string;
    task_id: string;
  }>;
}

mongoose.Promise = global.Promise;

const schema = new Schema<AttendeeList>({
  event_id: { type: String, required: true },
  event_name: { type: String, required: true },
  ticket_price: { type: Number, required: true },
  available_tickets: { type: Number, required: true },
  // list of user_ids
  reserved_tickets: [{ type: String, required: true }],
  attendees: [{ type: String, required: true }],
  reservation_expire_tasks: [
    {
      user_id: { type: String },
      task_id: { type: String },
    },
  ],
});

export const AttendeeList =
  (mongoose.models.AttendeeList as mongoose.Model<AttendeeList>) ||
  mongoose.model<AttendeeList>("AttendeeList", schema);
