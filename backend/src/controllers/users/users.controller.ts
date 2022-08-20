import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

import pool from "../../utils/postgres/postgres-pool";

import { TypeReturnMessage } from "../../types/TypeReturnMessage";
import ApiError from "../../types/ApiError";

/**
 * Récupère tous les utilisateurs
 */
export async function GetAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère les utilisateurs
    const users = await pool.query(
      "SELECT user_id, username, password, created_on, last_login FROM users ORDER BY user_id ASC"
    );

    // Renvoie les utilisateurs
    const jsonReturn: TypeReturnMessage = {
      message: "Users retrieved successfully",
      statusCode: 200,
      data: users.rows,
    };

    res.status(jsonReturn.statusCode).json(jsonReturn);
  } catch (error) {
    next(error);
  }
}

/**
 * Récupère un utilisateur selon son username
 */
export async function GetUserBySessionID(req: Request, res: Response, next: NextFunction) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = req.decodedJwt;

    // Récupère l'utilisateur
    const user = await pool.query(
      "SELECT user_id, username, password, created_on, last_login FROM users WHERE user_id = $1",
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
