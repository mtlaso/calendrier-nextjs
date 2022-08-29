import { Express } from "express";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "../types/TypeSocketIO";

/**
 * Initialiser le serveur socket.io (web sockets)
 * @param app Express application
 * @returns [io, io.engine]
 */
export default function InitSocketIO(app: Express, httpServer: any) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      allowedHeaders: "*",
      credentials: true,
    },
    path: "/calendar-sync",
  });

  io.engine.on("connection_error", (error: any) => {
    console.log(`(server) connection_error : ${error}`);
  });

  return [io, io.engine];
}
