import {NextRequest} from 'next/server';
import {auth, connectToDatabase} from '@lib';
import {ServerResponse, getSession} from '@helpers';

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const {authRequest, session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);

  return ServerResponse.success('Successfully logged out');
};
