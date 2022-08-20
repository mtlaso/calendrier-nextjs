import Express, { Request, Response, NextFunction } from "express";
import Session, { SessionOptions } from "express-session";
import ConnectRedis from "connect-redis";
import { createClient } from "redis";
require("dotenv").config();

import authRoute from "./routes/auth/auth.route";
import usersRoute from "./routes/users/users.route";

import ApiError from "./types/ApiError";
import { TypeReturnMessage } from "./types/TypeReturnMessage";
import { CheckContentType } from "./middlewares/check-content-type";
import { REDIS_CONNECT_SESSION_PREFIX, SESSION_COOKIE_NAME } from "./config/config";

const app = Express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

// Express session & redis store
const RedisStore = ConnectRedis(Session);
const redisClient = createClient({ legacyMode: true }); // Se connecte par défaut à localhost sur le port 6379
redisClient.connect().catch((err) => {
  throw new ApiError(`Redis error : ${err}`, 500);
});

const sessionConfig: SessionOptions = {
  store: new RedisStore({ client: redisClient as any, prefix: REDIS_CONNECT_SESSION_PREFIX }),
  name: SESSION_COOKIE_NAME,
  secret: process.env.SESSION_SECRET!,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: isProduction,
    httpOnly: isProduction,
    sameSite: "lax",
  },

  resave: false,
  saveUninitialized: false,
};

app.use(Session(sessionConfig));

declare module "express-session" {
  interface SessionData {
    /**
     * Information de l'utilisateur connecté (session)
     */
    jwtToken: string;
  }

  interface Request {
    decodedJwt?: string;
  }
}

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

// Vérifier le header "content-type"
app.use(CheckContentType);

// Routes
app.use("/auth", authRoute);
app.use("/users", usersRoute);

const MiddlewareHandleErrorsDev = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    const returnValue: TypeReturnMessage = { message: error.message, statusCode: error.statusCode };
    res.status(returnValue.statusCode).json(returnValue);
  } else {
    res.status(500).json({ message: `Internal server error`, statusCode: 500 });
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

app.listen(port, () => {
  console.log(`🌎 Server : http://localhost:${port}/`);
});
