import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    const user = await prisma.users.findUnique({
      where: {
        user_id:
          // @ts-ignore
          userInfo.user_id,
      },
    });

    // Renvoie l'utilisateur
    const jsonReturn: TypeReturnMessage = {
      message: "User retrieved successfully",
      statusCode: 200,
      data: user,
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
    const oldPasswordHash = await prisma.users.findUnique({
      where: {
        user_id:
          // @ts-ignore
          userInfo.user_id,
      },
      select: { password: true },
    });

    if (!oldPasswordHash?.password) {
      throw new ApiError("User not found", 404);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, oldPasswordHash.password);
    if (!isOldPasswordValid) {
      throw new ApiError("Old password invalid", 400);
    }

    // Valider le nouveau mot de passe
    ValidatUserPassword(newPassword);

    // Hash le nouveau mot de passe
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Modifie le mot de passe de l'utilisateur
    await prisma.users.update({
      where: {
        user_id:
          // @ts-expect-error
          userInfo.user_id,
      },
      data: { password: newHashedPassword },
    });

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
    const eventsNumber = await prisma.events.count({
      where: {
        user_id:
          // @ts-expect-error
          userInfo.user_id,
      },
    });

    // Renvoie le nombre d'événements
    const jsonReturn: TypeReturnMessage = {
      message: "User events number retrieved successfully",
      statusCode: 200,
      data: { count: eventsNumber },
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
    await prisma.events.deleteMany({
      where: {
        // @ts-expect-error
        user_id: userInfo.user_id,
      },
    });

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
