import {ServerResponse} from '@helpers/serverResponse';
import {auth, googleAuth} from '@lib/lucia';
import {OAuthRequestError} from '@lucia-auth/oauth';
import {cookies, headers} from 'next/headers';
import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';
import {getDomain} from 'tldts';

export const GET = async (request: NextRequest) => {
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');

  try {
    const googleObj = await googleAuth.validateCallback(code!);
    console.log(googleObj.googleUser);

    return ServerResponse.success('Success');
    /*
    const userAttributes = {
      first_name: googleUser.given_name,
      last_name: googleUser.family_name,
      email_address: 'no-email@gmail.com',
      email_verified: true,
      role: 'Google Test User',
      domain: 'gmail.com',
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
    return NextResponse.redirect(new URL('/my-company', request.url));
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      return ServerResponse.userError('Bad OAUTH REQUEST');
    }
    return ServerResponse.serverError();
  }
  */
  } catch (e) {
    console.log(e);
  }
};
