import {BroadcastChannel} from 'broadcast-channel';

type AuthBroadcastMessage = 'reload-auth';

export const authBroadcast: BroadcastChannel<AuthBroadcastMessage> =
  new BroadcastChannel('authentication', {type: 'native'});
