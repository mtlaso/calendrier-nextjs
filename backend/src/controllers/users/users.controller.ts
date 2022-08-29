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

/**
 * Retourne les événements d'un utilisateur
 */
export async function GetUserEvents(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    console.log("Gettings user events...");

    // Récupère les événements de l'utilisateur
    const client = await pool.connect();
    const events = await client.query(
      "SELECT event_id, event_creation_date, event_date, title, is_completed FROM events WHERE user_id = $1",
      // @ts-expect-error
      [userInfo.user_id]
    );

    client.release();

    console.log(`Will send back : ${events.rows.length} events`);

    // Renvoie les événements de l'utilisateur
    const jsonReturn: TypeReturnMessage = {
      message: "User events retrieved successfully",
      statusCode: 200,
      data: events.rows,
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}

/**
 * Met à jour les événements d'un utilisateur
 */
export async function UpdateUserEvents(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère les événements de l'utilisateur
    const events: any[] = req.body.events;
    console.log("Saving to db these events... ", events);

    // Met à jour les événements de l'utilisateur
    const client = await pool.connect();
    const query = `INSERT INTO events (user_id, event_id, event_creation_date, event_date, title, is_completed)
                  VALUES ($1, $2, $3, $4, $5, $6) 
                  ON CONFLICT (event_id) DO UPDATE SET event_creation_date = $3, event_date = $4, title = $5, is_completed = $6
    `;
    for (const event of events) {
      await client.query(query, [
        // @ts-expect-error
        userInfo.user_id,
        event.event_id,
        event.event_creation_date,
        event.event_date,
        event.title,
        event.is_completed,
      ]);
    }

    client.release();

    // Renvoie le message de succès
    const jsonReturn: TypeReturnMessage = {
      message: "User events saved successfully",
      statusCode: 200,
      data: "Ok !",
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (err) {
    next(err);
  }
}
