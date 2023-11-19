import { BroadcastChannel } from "broadcast-channel";

export type AuthBroadcastMessage = "reload-auth";

export const authBroadcast: BroadcastChannel<AuthBroadcastMessage> =
  new BroadcastChannel("authentication", { type: "native" });
