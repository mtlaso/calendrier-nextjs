import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

import pool from "../../utils/postgres/postgres-pool";

import { TypeJsonReturn } from "../../types/TypeJsonReturn";
import ApiError from "../../types/ApiError";
import { ValidateUserInfo } from "./validators/validate-user-info";

/**
 * Register controller
 */
export const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, password } = req.body;

    // Valider champs
    const isValid = ValidateUserInfo(username, password);
    if (isValid instanceof ApiError) {
      throw isValid;
    }

    username = username.trim();
    password = password.trim();

    // Vérifier si le username existe
    const result = await pool.query("SELECT user_id FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      throw new ApiError("Username already exists", 400);
    }

    // Hash le mot de passe
    password = await bcrypt.hash(password, 10);

    // Générer un id du user
    const userId = uuidv4();

    // Créer compte
    await pool.query(
      `INSERT INTO users (user_id, username, password, created_on, last_login)
     VALUES ($1, $2, $3, $4, $5)`,
      [userId, username, password, new Date(), new Date()]
    );

    // Message de confirmation
    const returnValue: TypeJsonReturn = { message: `User created : ${username}`, statusCode: 200 };

    res.status(returnValue.statusCode).json(returnValue);
  } catch (error) {
    next(error);
  }
};

/**
 * Login controller
 */
export const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, password } = req.body;

    // Valider champs
    const isValid = ValidateUserInfo(username, password);
    if (isValid instanceof ApiError) {
      throw isValid;
    }

    username = username.trim();
    password = password.trim();

    // Vérifier si le username existe
    const result = await pool.query("SELECT user_id, password FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      throw new ApiError("Username doesn't exist", 400);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);
    if (!isPasswordValid) {
      throw new ApiError("Password is incorrect", 400);
    }

    // Initialiser la session
    const sess = req.session;
    sess.userInfo = {
      user_id: result.rows[0].user_id,
      username: username,
      password: password,
    };

    // Message de confirmation
    const returnValue: TypeJsonReturn = { message: `logged in successfully`, statusCode: 200 };
    res.status(returnValue.statusCode).json(returnValue);
  } catch (error) {
    next(error);
  }
};
