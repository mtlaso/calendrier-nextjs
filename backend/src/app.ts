import Express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
require("dotenv").config();

import authRoute from "./routes/auth/auth.route";
import usersRoute from "./routes/users/users.route";
import { OnConnectionRoute } from "./routes/calendar:events/calendar:events.route";

import ApiError from "./types/ApiError";
import { TypeReturnMessage } from "./types/TypeReturnMessage";
import { CheckContentType } from "./middlewares/check-content-type";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./types/TypeSocketIO";
import { DecodeJWTToken } from "./utils/jwt/jwt-utils";

const app = Express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

// Extention interface request de Express
declare module "express-serve-static-core" {
  interface Request {
    /**
     * Pour passer le jwt
     */
    decodedJwt?: string;
  }
}

// Désactiver le header "x-Powered-By"
app.disable("x-powered-by");

// Cors
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

// Config Socket.io
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: "*",
    credentials: true,
  },
  path: "/calendar-sync",
});

const calendarEventsNamespace = io.of("/calendar-sync");

io.engine.on("connection_error", (error: any) => {
  console.log(`(server) connection_error : ${error}`);
});

calendarEventsNamespace.on("connection", (socket: Socket) => {
  OnConnectionRoute(socket, io);
});

// Vérifier le header "content-type"
app.use(CheckContentType);

// Routes
app.use("/auth", authRoute);
app.use("/users", usersRoute);

// Error middlewares
const MiddlewareHandleErrorsDev = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    const returnValue: TypeReturnMessage = { message: error.message, statusCode: error.statusCode };
    res.status(returnValue.statusCode).json(returnValue);
  } else {
    const message = (error as Error).message;
    res.status(500).json({ message: `Internal server error : ${message}`, statusCode: 500 });
  }
};

const MiddlewareHandleErrorsProd = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    // Ne pas envoyer de message d'erreur à l'utilisateur si on est en production
    const returnValue: TypeReturnMessage = { message: "", statusCode: error.statusCode };
    res.status(returnValue.statusCode).json(returnValue);
  } else {
    res.status(500).json({ message: `Internal server error`, statusCode: 500 });
  }
};

// Error middleware
app.use(isProduction ? MiddlewareHandleErrorsProd : MiddlewareHandleErrorsDev);

httpServer.listen(port, () => {
  console.log(`🌎 Server : http://localhost:${port}/`);
});
