import {NextRequest} from 'next/server';
import z from 'zod';
import {auth, connectToDatabase, logger} from '@lib';
import * as context from 'next/headers';
import {LuciaError} from 'lucia';
import {ServerResponse} from '@helpers';
import {User} from '@models';

const loginSchema = z.object({
  email_address: z.string({required_error: 'Email address is required'}),
  password: z.string({required_error: 'Password is required'}),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const {email_address, password} = await request.json();

  const validation = loginSchema.safeParse({
    email_address,
    password,
  });

  if (validation.success) {
    try {
      const luciaUser = await auth.useKey(
        'email_address',
        email_address.toLowerCase(),
        password
      );

      // user query from mongodb
      const user = await User.findOne({email_address});

      if (!user.email_verified) {
        return ServerResponse.userError('Verify your email before logging in');
      }

      const session = await auth.createSession({
        userId: luciaUser.userId,
        attributes: {},
      });

      const authRequest = auth.handleRequest(request.method, context);

      authRequest.setSession(session);

      return ServerResponse.success(luciaUser);
    } catch (e) {
      logger.error(e);

      if (
        e instanceof LuciaError &&
        (e.message === 'AUTH_INVALID_KEY_ID' ||
          e.message === 'AUTH_INVALID_PASSWORD')
      ) {
        // user does not exist or invalid password
        return ServerResponse.userError('Invalid email or password');
      }

      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
