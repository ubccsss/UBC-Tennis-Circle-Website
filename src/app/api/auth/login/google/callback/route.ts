import {ServerResponse} from '@helpers';
import {auth, googleLogin} from '@lib/lucia';
import {OAuthRequestError} from '@lucia-auth/oauth';
import {cookies, headers} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

export const GET = async (request: NextRequest) => {
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');

  if (!state || !code) {
    return ServerResponse.serverError('Could not process request');
  }

  try {
    const {getExistingUser, googleUser} = await googleLogin.validateCallback(
      code!
    );

    const userAttributes = {
      first_name: googleUser.given_name,
      last_name: googleUser.family_name,
      email_address: googleUser.email,
      email_verified: googleUser.email_verified,
      skill: 1,
      instagram: null,
      profile: googleUser.picture,
    };

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;

      return NextResponse.redirect(
        new URL('/login?bad-oauth=true', request.url)
      );
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: userAttributes,
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