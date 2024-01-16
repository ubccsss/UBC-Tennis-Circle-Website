import mongoose, {Schema} from 'mongoose';

export interface Token {
  _id: string;
  expires: Date;
  user_id: string;
}

mongoose.Promise = global.Promise;

const schema = new Schema<Token>(
  {
    _id: {type: String, required: true},
    expires: {type: Date, required: true},
    user_id: {type: String, required: true},
  },
  {_id: false}
);

export const Token =
  mongoose.models?.Token || mongoose.model<Token>('Token', schema);
