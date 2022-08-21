import Express, { Request, Response, NextFunction } from "express";
require("dotenv").config();

import authRoute from "./routes/auth/auth.route";
import usersRoute from "./routes/users/users.route";

import ApiError from "./types/ApiError";
import { TypeReturnMessage } from "./types/TypeReturnMessage";
import { CheckContentType } from "./middlewares/check-content-type";

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
