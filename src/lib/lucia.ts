import {lucia} from 'lucia';
import {nextjs_future} from 'lucia/middleware';
import {mongoose} from '@lucia-auth/adapter-mongoose';
import {User, Key, Session} from '@models';
import {google} from '@lucia-auth/oauth/providers';

export const auth = lucia({
  adapter: mongoose({
    User,
    Key,
    Session,
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },

  getUserAttributes: data => {
    return {
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      email_verified: data.email_verified,
      skill: data.skill,
      instagram: data.instagram,
      profile: data.profile,
      provider: data.provider,
    };
  },
});

const googleController = (redirectUri: string) => ({
  clientId: process.env.NEXT_OAUTH_ID!,
  clientSecret: process.env.NEXT_OAUTH_SECRET!,
  scope: ['https://www.googleapis.com/auth/userinfo.email'],
  redirectUri,
});

export const googleSignup = google(
  auth,
  googleController(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/signup/google/callback`
  )
);

export const googleLogin = google(
  auth,
  googleController(
    `${process.env.NEXT_PUBLIC_HOSTNAME}/api/auth/login/google/callback`
  )
);

export type Auth = typeof auth;
