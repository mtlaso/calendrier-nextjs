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
  hello: () => void;

  // Événements custom

  /**
   * Événement pour synchroniser les données du calendrier
   */
  "calendar:sync": (data: TypeEvent[]) => void;

  /**
   * Événement pour supprimer un événement du calendrier
   */
  "calendar:sync:delete": (event_id: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;

  // Données custom

  /**
   * Jwt passé dans le middleware
   */
  jwt: any;
}
