import { Server, Socket } from "socket.io";
import { TypeEvent } from "../../types/TypeEvent";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../types/TypeSocketIO";

import {
  ChangeEventDateInDb,
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
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
) => {
  // Rejoindre la bonne room (son user_id) pour que l'utilisateur soit seul dans sa room
  // Pour éviter que plusieurs utilisateurs puissent modifier les mêmes événements
  socket.on("calendar:join", async ({ jwt }) => {
    try {
      // Decode le jwt
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);

      // Rejoindre la room avec son user_id
      socket.join(decodedJwt.user_id);
    } catch (err) {
      throw err;
    }
  });

  // Sauvegarder les événements dans la base de données et les envoyer aux clients
  socket.on("calendar:sync", async ({ events, jwt }) => {
    try {
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);

      // Sauvegarder les événements de l'utilisateur dans la base de données
      await SaveEventsToDb(events, decodedJwt);

      // Lire les événements de l'utilisateur
      const newEvents = await ReadEventsFromDb(decodedJwt);

      // Renvoie les événements au même client qui à envoyé la requête
      socket.emit("calendar:sync", newEvents);

      // Envoyer les événements au client
      socket.to(decodedJwt.user_id).emit("calendar:sync", newEvents);
    } catch (err) {
      throw err;
    }
  });

  // Supprimer un événement de la base de données
  socket.on("calendar:delete", async ({ event_id, jwt }) => {
    try {
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);

      // Supprimer l'événement de la base de données
      await DeleteEventFromDb(event_id, decodedJwt);
    } catch (err) {
      throw err;
    }
  });

  // Changer la date d'un événement (drag and drop)
  socket.on("calendar:change-date", async ({ event_id, newDate, jwt }) => {
    try {
      const decodedJwt = await DecodeJWTToken(jwt.split("Bearer ")[1]);

      // Changed la date de l'événement dans la base de données
      await ChangeEventDateInDb(event_id, newDate, decodedJwt);

      // Lire les événements de l'utilisateur
      const newEvents = await ReadEventsFromDb(decodedJwt);

      // Envoyer les événements au client
      socket.to(decodedJwt.user_id).emit("calendar:sync", newEvents);
    } catch (err) {
      throw err;
    }
  });
};
