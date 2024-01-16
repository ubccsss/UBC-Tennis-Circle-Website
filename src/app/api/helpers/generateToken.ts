import {generateRandomString} from 'lucia/utils';
import {Token} from '@models';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from './serverResponse';

const EXPIRES_IN = 1000 * 60 * 60; // expiry for token set to 1 hour

export const generatePasswordResetToken = async (userId: string) => {
  await connectToDatabase();

  const token = generateRandomString(63);
  try {
    await Token.create({
      _id: token,
      expires: new Date().getTime() + EXPIRES_IN,
      user_id: userId,
    });
    return token;
  } catch (e) {
    return ServerResponse.serverError('An unexpected error occurred');
  }
};
