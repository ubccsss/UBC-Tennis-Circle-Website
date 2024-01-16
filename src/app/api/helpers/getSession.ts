import {auth} from '@lib/lucia';
import {Session} from 'lucia';
import * as context from 'next/headers';
import {NextRequest} from 'next/server';

export const getSession = async (req: NextRequest) => {
  const authRequest = auth.handleRequest(req.method, context);
  const session: Session = await authRequest.validate();
  return {authRequest, session};
};
