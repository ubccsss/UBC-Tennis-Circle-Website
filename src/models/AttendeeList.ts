import mongoose, { Schema } from "mongoose";

export type UserId = string;

export interface AttendeeList {
  _id: string;
  event_id: string;
  event_name: string;
  status: "open" | "closed";
  tasks: {
    close: string;
    clean: string;
  };
  ticket_price: number;
  available_tickets: number;
  reserved_tickets: Array<string>;
  attendees: Array<UserId>;
  time_slot: number;
  payments: Array<string>;
  reservation_expire_tasks: Array<{
    user_id: string;
    task_id: string;
  }>;
}

mongoose.Promise = global.Promise;

const schema = new Schema<AttendeeList>({
  event_id: { type: String, required: true },
  event_name: { type: String, required: true },
  status: { type: String, required: true },
  tasks: {
    close: { type: String, required: true },
    clean: { type: String, required: true },
  },
  ticket_price: { type: Number, required: true },
  available_tickets: { type: Number, required: true },
  time_slot: { type: Number, required: true },
  // list of user_ids
  reserved_tickets: [{ type: String, required: true }],
  attendees: [{ type: String, required: true }],
  payments: [{ type: String, required: true }],
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
