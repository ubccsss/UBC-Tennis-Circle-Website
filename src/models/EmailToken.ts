import mongoose, {Schema} from 'mongoose';

export interface EmailToken {
  _id: string;
  expires: Date;
  user_id: string;
  email_address: string;
}

mongoose.Promise = global.Promise;

const schema = new Schema<EmailToken>(
  {
    _id: {type: String, required: true},
    expires: {type: Date, required: true},
    user_id: {type: String, required: true},
    email_address: {type: String, required: true},
  },
  {_id: false}
);

export const EmailToken =
  mongoose.models?.EmailToken ||
  mongoose.model<EmailToken>('EmailToken', schema);
