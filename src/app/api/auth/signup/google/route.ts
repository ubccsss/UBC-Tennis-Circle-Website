import {googleSignup} from '@lib/lucia';
import * as context from 'next/headers';

export const GET = async () => {
  const [url, state] = await googleSignup.getAuthorizationUrl();
  // store state
  context.cookies().set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
};
