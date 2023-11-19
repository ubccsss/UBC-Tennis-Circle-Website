import mongoose, { Schema } from "mongoose";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  email_verified: boolean;
  email_verification_token?: {
    id: string;
  };
}

mongoose.Promise = global.Promise;

const schema = new Schema<User>(
  {
    _id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email_address: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, required: true },
    email_verification_token: {
      id: { type: String, unique: true },
      // TODO: Add token expiration
    },
  },
  { _id: false }
);

export const User =
  mongoose.models.User || mongoose.model<User>("User", schema);
