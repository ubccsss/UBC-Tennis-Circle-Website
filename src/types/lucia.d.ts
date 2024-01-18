import {User} from '@models';
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('../lib/auth').Auth;
  type DatabaseUserAttributes = Omit<User, '_id' | 'email_verification_token'>;
  type DatabaseSessionAttributes = {};
}
