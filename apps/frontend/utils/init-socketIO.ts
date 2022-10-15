import { io, Socket } from "socket.io-client";

import { ServerToClientEvents, ClientToServerEvents } from "@calendar-nextjs/shared/types/TypeSocketIO";

import { CALENDAR_NAMESPACE } from "@calendar-nextjs/shared/config/global-config";

/**
 * Initiliser socketIO
 * @param jwt Jwt
 */
export default function InitSocketIO(jwt: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io("http://localhost:4000/calendar-sync", {
    withCredentials: true,
    upgrade: true,
    path: CALENDAR_NAMESPACE,
    auth: {
      Authorization: `${jwt}`,
    },
  });
}
