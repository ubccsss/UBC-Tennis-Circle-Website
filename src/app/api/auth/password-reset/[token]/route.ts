import {connectToDatabase} from '@lib/mongoose';
import z from 'zod';
import {logger} from '@lib/winston';
import type {NextRequest} from 'next/server';
import {ServerResponse} from '@helpers/serverResponse';
import {Token} from '@models/Token';
import {auth} from '@lib/lucia';
import {isWithinExpiration} from 'lucia/utils';

const passwordResetSchema = z.object({
  new_password: z
    .string({required_error: 'Password is required'})
    .min(8, {message: 'Password must be at least 8 characters'}),
});

export const POST = async (
  request: NextRequest,
  {
    params,
  }: {
    params: {
      token: string;
    };
  }
) => {
  await connectToDatabase();

  const body = await request.json();

  const validation = passwordResetSchema.safeParse(body);
  if (validation.success) {
    try {
      const {token} = params;

      const storedToken = await Token.findOne({
        _id: token,
      });

      if (!storedToken) {
        return ServerResponse.userError('Invalid token');
      }

      const tokenExpires = Number(storedToken.expires);

      if (!isWithinExpiration(tokenExpires)) {
        return ServerResponse.userError('Expired token');
      }

      const user = await auth.getUser(storedToken.user_id);
      await auth.invalidateAllUserSessions(user.userId);
      await auth.updateKeyPassword(
        'email_address',
        user.email_address,
        body.new_password
      );
      return ServerResponse.success('Password successfully reset');
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError('Server error');
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
