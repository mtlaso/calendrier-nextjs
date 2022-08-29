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
  "calendar:sync": (data: TypeEvent[], callback: () => void) => void;
}

/**
 * Événements envoyés depuis le client au server
 */
export interface ClientToServerEvents {
  hello: () => void;

  // Événements custom

  /**
   * Événement pour synchroniser les données du calendrier
   */
  "calendar:sync": (data: TypeEvent[], jwt: string, callback: () => void) => void;

  /**
   * Événement pour supprimer un événement du calendrier
   */
  "calendar:sync:delete": (event_id: string, jwt: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
