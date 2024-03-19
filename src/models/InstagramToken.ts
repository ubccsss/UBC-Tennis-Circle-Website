import mongoose, { Schema } from "mongoose";

export interface InstagramToken {
  _id: string;
  token: string;
  expires: number;
}

mongoose.Promise = global.Promise;

const schema = new Schema<InstagramToken>({
  token: { type: String, required: true },
  expires: { type: Number, required: true },
});

export const InstagramToken =
  (mongoose.models.InstagramToken as mongoose.Model<InstagramToken>) ||
  mongoose.model<InstagramToken>("InstagramToken", schema);
