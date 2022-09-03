import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();

import pool from "../../utils/postgres/postgres-pool";

import { TypeReturnMessage } from "../../types/TypeReturnMessage";
import { ValidatUserPassword } from "./validators/validate-user-password";
import ApiError from "../../types/ApiError";

/**
 * Récupère un utilisateur
 */
export async function GetUser(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère l'utilisateur
    const client = await pool.connect();
    const user = await client.query(
      "SELECT user_id, username, created_on, last_login FROM users WHERE user_id = $1",
      // @ts-expect-error
      [userInfo.user_id]
    );
    client.release();

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
    const { oldPassword, newPassword } = req.body;

    // Valider ancien mot de passe
    const client = await pool.connect();
    const oldPasswordHash = await client.query(
      "SELECT password FROM users WHERE user_id = $1",
      // @ts-expect-error
      [userInfo.user_id]
    );

    if (oldPasswordHash.rowCount < 1) {
      throw new ApiError("User not found", 404);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, oldPasswordHash.rows[0].password);
    if (!isOldPasswordValid) {
      throw new ApiError("Old password invalid", 400);
    }

    // Valider le nouveau mot de passe
    ValidatUserPassword(newPassword);

    // Hash le nouveau mot de passe
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Modifie le mot de passe de l'utilisateur
    await client.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      newHashedPassword,
      // @ts-expect-error
      userInfo.user_id,
    ]);
    client.release();

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

/**
 * Retourne le nombre d'événements que l'utilisateur à créé
 */
export async function GetUserEventsNumber(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère le nombre d'événements que l'utilisateur à créé
    const client = await pool.connect();
    const eventsNumber = await client.query(
      "SELECT COUNT(title) FROM events WHERE user_id = $1",
      // @ts-expect-error
      [userInfo.user_id]
    );
    client.release();

    // Renvoie le nombre d'événements
    const jsonReturn: TypeReturnMessage = {
      message: "User events number retrieved successfully",
      statusCode: 200,
      data: { count: eventsNumber.rows[0].count },
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}

/**
 * Supprime tous les événements d'un utilisateur
 */
export async function DeleteUserEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const userInfo = req.decodedJwt;

    // Supprime tous les événements de l'utilisateur
    const client = await pool.connect();
    await client.query("DELETE FROM events WHERE user_id = $1", [
      // @ts-expect-error
      userInfo.user_id,
    ]);
    client.release();

    // Renvoie le message de succès
    const jsonReturn: TypeReturnMessage = {
      message: "User events deleted successfully",
      statusCode: 200,
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}
