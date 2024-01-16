import {generateRandomString} from 'lucia/utils';
import {EmailToken} from '@models/EmailToken';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from './serverResponse';

const EXPIRES_IN = 1000 * 60 * 60; // expiry for token set to 1 hour

export const generateEmailResetToken = async (
  userId: string,
  new_email: string
) => {
  await connectToDatabase();

  const token = generateRandomString(63);
  try {
    await EmailToken.create({
      _id: token,
      expires: new Date().getTime() + EXPIRES_IN,
      user_id: userId,
      email_address: new_email,
    });
    return token;
  } catch (e) {
    return ServerResponse.serverError('An unexpected error occurred');
  }
};
