import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();

import pool from "../../utils/postgres/postgres-pool";

import { TypeReturnMessage } from "../../types/TypeReturnMessage";
import ApiError from "../../types/ApiError";
import { ValidatUserPassword } from "./validators/validate-user-password";

/**
 * Récupère un utilisateur
 */
export async function GetUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère l'utilisateur
    const user = await pool.query(
      "SELECT user_id, username, created_on, last_login FROM users WHERE user_id = $1",
      // @ts-expect-error
      [userInfo.user_id]
    );

    // Renvoie l'utilisateur
    const jsonReturn: TypeReturnMessage = {
      message: "User retrieved successfully",
      statusCode: 200,
      data: user.rows[0],
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}

/**
 * Modifie le mot de passe d'un utilisateur
 */
export async function UpdateUserPassword(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère le nouveau mot de passe
    const { password } = req.body;

    // Valider mot de passe
    ValidatUserPassword(password);

    // Hash le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Modifie le mot de passe de l'utilisateur
    await pool.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",

      [
        hashedPassword,
        // @ts-expect-error
        userInfo.user_id,
      ]
    );

    // Renvoie le message de succès
    const jsonReturn: TypeReturnMessage = {
      message: "User password updated successfully",
      statusCode: 200,
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}
