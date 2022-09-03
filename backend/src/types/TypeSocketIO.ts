import { TypeEvent } from "./TypeEvent";

/**
 * Événements envoyés depuis le serveur au client
 */
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;

  // Événements custom

  /**
   * Événement pour synchroniser les données du calendrier
   */
  "calendar:sync": (data: TypeEvent[]) => void;
}

/**
 * Événements envoyés depuis le client au server
 */
export interface ClientToServerEvents {
  /**
   * Événement pour rejoindre la bonne room
   */
  "calendar:join": (data: { jwt: string }) => void;

  /**
   * Événement pour synchroniser les données du calendrier
   */
  "calendar:sync": (data: { events: TypeEvent[]; jwt: string }, callback: () => void) => void;

  /**
   * Événement pour supprimer un événement du calendrier
   */
  "calendar:delete": (data: { event_id: string; jwt: string }) => void;

  /**
   * Événement pour changer la date d'un événement du calendrier (drag & drop)
   */
  "calendar:change-date": (data: { event_id: string; newDate: Date; jwt: string }, callback: () => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
