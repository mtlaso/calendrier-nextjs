import Express, { Request, Response, NextFunction } from "express";
import session, { SessionOptions } from "express-session";
require("dotenv").config();

import authRoute from "./routes/auth/auth.route";

import ApiError from "./types/ApiError";
import { TypeJsonReturn } from "./types/TypeJsonReturn";

const app = Express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === "production";

// Express session
const sessionConfig: SessionOptions = {
  name: "session-cookie",
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

app.use(session(sessionConfig));

declare module "express-session" {
  interface SessionData {
    /**
     * Information de l'utilisateur connecté (session)
     */
    userInfo: {
      /**
       * User id
       */
      user_id: string;
      /**
       * Username
       */
      username: string;
      /**
       * Password
       */
      password: string;
    };
  }
}

// Désactiver le header "x-Powered-By"
app.disable("x-powered-by");

// Authentication route
app.use("/auth", authRoute);

const MiddlewareHandleErrorsDev = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("called middleware");
  if (error instanceof ApiError) {
    const returnValue: TypeJsonReturn = { message: error.message, statusCode: error.statusCode };
    res.status(returnValue.statusCode).json(returnValue);
  } else {
    res.status(500).json({ message: `Internal server error`, statusCode: 500 });
  }
};

const MiddlewareHandleErrorsProd = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    // Ne pas envoyer de message d'erreur à l'utilisateur si on est en production
    const returnValue: TypeJsonReturn = { message: "", statusCode: error.statusCode };
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
