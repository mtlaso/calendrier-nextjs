import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { ValidateUserInfo } from "./validators/validate-user-info";
import { GenerateJWTToken } from "../../utils/jwt/jwt-utils";

import ApiError from "../../types/ApiError";
import { TypeReturnMessage } from "../../types/TypeReturnMessage";

/**
 * Register controller
 */
export const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { username, password } = req.body;

    // Valider champs
    ValidateUserInfo(username, password);

    username = username.trim();
    password = password.trim();

    // Vérifier si le username existe
    const userExists = await prisma.users.findUnique({ where: { username: username } });
    if (userExists) {
      throw new ApiError("Username already exists", 400);
    }

    // Hash le mot de passe
    password = await bcrypt.hash(password, 10);

    // Générer un id du user
    const userId = uuidv4();

    // Créer compte
    await prisma.users.create({
      data: {
        user_id: userId,
        username: username,
        password: password,
        created_on: new Date(),
        last_login: new Date(),
      },
    });

    // Message de confirmation
    const returnValue: TypeReturnMessage = { message: `User created : ${username}`, statusCode: 200 };

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
    ValidateUserInfo(username, password);

    username = username.trim();
    password = password.trim();

    // Vérifier si le username existe
    const user = await prisma.users.findUnique({ where: { username: username } });
    if (!user) {
      throw new ApiError("Username doesn't exist", 400);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError("Password is incorrect", 400);
    }

    // Changer le last_login de l'utilisateur
    await prisma.users.update({ where: { user_id: user.user_id }, data: { last_login: new Date() } });

    // Créer JWT token
    const jwtToken = await GenerateJWTToken({
      user_id: user.user_id,
    });

    const bearer = `Bearer ${jwtToken}`;

    // Retourner jwt dans le header
    res.setHeader(`Authorization`, bearer);

    // Message de confirmation
    const returnValue: TypeReturnMessage = {
      message: `Logged in successfully`,
      statusCode: 200,
      data: {
        jwtToken: bearer,
      },
    };

    res.status(returnValue.statusCode).json(returnValue);
  } catch (error) {
    next(error);
  }
};
