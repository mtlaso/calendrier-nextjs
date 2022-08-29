import { Socket } from "socket.io";
import { TypeEvent } from "../../types/TypeEvent";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../types/TypeSocketIO";

import {
  DeleteEventFromDb,
  ReadEventsFromDb,
  SaveEventsToDb,
} from "../../controllers/calendar:events/calendar:events.controller";
import { DecodeJWTToken } from "../../utils/jwt/jwt-utils";

/**
 * Événement socket.io pour gérer la connection d'un client
 * @param socket Socket.io socket
 */
export const OnConnectionRoute = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  // Sauvegarder les événements dans la base de données et les envoyer aux clients
  socket.on("calendar:sync", async (data: TypeEvent[], jwt: string) => {
    try {
      // const decodedJwt = await DecodeJwtSocketIO(jwt);
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);

      // Sauvegarder les événements de l'utilisateur dans la base de données
      await SaveEventsToDb(data, decodedJwt);

      // Lire les événements de l'utilisateur
      const newEvents = await ReadEventsFromDb(decodedJwt);

      // Renvoie les événements au même client qui à envoyé la requête
      socket.emit("calendar:sync", newEvents, () => {});
    } catch (err) {
      throw err;
    }
  });

  // Supprimer un événement de la base de données
  socket.on("calendar:sync:delete", async (event_id: string, jwt: string) => {
    try {
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);
      await DeleteEventFromDb(event_id, decodedJwt);
    } catch (err) {
      throw err;
    }
  });
};
