import {ServerResponse} from '@helpers/serverResponse';
import {auth, googleAuth} from '@lib/lucia';
import {OAuthRequestError} from '@lucia-auth/oauth';
import {User} from '@models/User';
import {cookies, headers} from 'next/headers';
import {NextResponse, NextRequest} from 'next/server';

export const GET = async (request: NextRequest) => {
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');

  if (!state || !code) {
    return ServerResponse.serverError('Could not process request');
  }

  try {
    const {getExistingUser, createUser, googleUser} =
      await googleAuth.validateCallback(code!);

    const userAttributes = {
      first_name: googleUser.given_name,
      last_name: googleUser.family_name,
      email_address: googleUser.email,
      email_verified: googleUser.email_verified,
    };

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: userAttributes,
      });
      return user;
    };
    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);
    return NextResponse.redirect(new URL('/', request.url));
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      return ServerResponse.userError('Bad oauth request');
    }
    return ServerResponse.serverError();
  }
};
