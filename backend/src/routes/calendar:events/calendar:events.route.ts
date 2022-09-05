import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../../types/TypeSocketIO";

import {
  ChangeEventDateInDb,
  DeleteEventFromDb,
  ReadEventsFromDb,
  SaveEventsToDb,
} from "../../controllers/calendar:events/calendar:events.controller";
import { DecodeJWTToken } from "../../utils/jwt/jwt-utils";
import { CALENDAR_NAMESPACE } from "../../config/config";

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

      // Envoyer message de confirmation au client qui vient de se connecter
      socket.emit("calendar:joined");
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

      // Envoyer les événements à tous les clients connectés dans la room de l'utilisateur
      // socket.nsp.to(decodedJwt.user_id).emit("calendar:sync", newEvents);

      // Renvoie les événements au même client qui à envoyé la requête (pour éviter de faire une requête supplémentaire)
      // et ensuite à tous les autres clients dans la même room (ex : le même utilisateur, mais avec d'autres onglets/appareils)
      socket.emit("calendar:sync", newEvents);
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
};
