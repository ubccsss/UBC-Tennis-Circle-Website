import {ServerResponse} from '@helpers';
import {auth, googleSignup} from '@lib/lucia';
import {OAuthRequestError} from '@lucia-auth/oauth';
import {cookies, headers} from 'next/headers';
import {NextResponse, NextRequest} from 'next/server';
import {User} from '@models/User';

export const GET = async (request: NextRequest) => {
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');

  if (!state || !code) {
    return ServerResponse.serverError('Could not process request');
  }

  try {
    const {createUser, googleUser} = await googleSignup.validateCallback(code!);

    const userAttributes = {
      first_name: googleUser.given_name,
      last_name: googleUser.family_name,
      email_address: googleUser.email,
      email_verified: googleUser.email_verified,
      skill: 1,
      instagram: null,
      profile: googleUser.picture,
    };

    const sameEmailUser = await User.findOne({
      email_address: userAttributes.email_address,
    });

    if (sameEmailUser) {
      return NextResponse.redirect(
        new URL('/signup?same-google-email=true', request.url)
      );
    }

    const getUser = async () => {
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
    return NextResponse.redirect(new URL('/profile/setup', request.url));
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      return ServerResponse.userError('Bad oauth request');
    }
    return ServerResponse.serverError();
  }
};
