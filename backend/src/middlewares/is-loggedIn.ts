import { Request, Response, NextFunction } from "express";

import ApiError from "../types/ApiError";
import { DecodeJWTToken } from "../utils/jwt/jwt-utils";

/**
 * Vérifie si un utilisateur est connecté
 */
export default async function IsLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère le token jwt
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new ApiError("authorization token missing", 401);
    }

    // Vérifie si le token est valide
    const decodedJwt = await DecodeJWTToken(token);

    // Ajoute le token au body de la requête
    req.decodedJwt = decodedJwt;

    next();
  } catch (err) {
    next(err);
  }
}
