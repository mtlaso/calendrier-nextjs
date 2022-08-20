import { Request, Response, NextFunction } from "express";
import { REDIS_CONNECT_SESSION_PREFIX, SESSION_COOKIE_NAME } from "../config/config";
import ApiError from "../types/ApiError";
import { DecodeJWTToken } from "../utils/jwt/jwt-utils";

/**
 * Vérifie si un utilisateur est connecté
 */
export default async function IsLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupérer token
    const sessionCookie = req.headers[SESSION_COOKIE_NAME];
    if (!sessionCookie) {
      throw new ApiError("Must be logged in", 401);
    }

    // Clé pour retrouver la session dans le cache redis
    const redisKey = (sessionCookie as string).split(".")[0].split(":")[1];

    // Vérifier si il est dans le cache redis
    req.sessionStore.get(redisKey, async (err, session) => {
      if (err) {
        throw new ApiError(`[Redis] is-loggedIn error: ${err}`, 401);
      }

      if (session === null || session === undefined) {
        throw new ApiError("Must be logged in", 401);
      }

      // Decoder le jwt token
      const decodedJwtToken = await DecodeJWTToken(session?.jwtToken!);

      req.decodedJwt = decodedJwtToken;

      next();
    });
  } catch (err) {
    next(err);
  }
}
