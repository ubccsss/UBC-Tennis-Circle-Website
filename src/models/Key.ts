import mongoose, { Schema } from "mongoose";

export interface Key {
  _id: string;
  user_id: string;
  hashed_password?: string;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Key>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true },
    hashed_password: String,
  },
  { _id: false }
);

export const Key = mongoose.models?.Key || mongoose.model<Key>("Key", schema);
