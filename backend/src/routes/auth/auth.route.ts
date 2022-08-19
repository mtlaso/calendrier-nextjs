/**
 * Authendication route
 */

import Express, { Router } from "express";
require("dotenv").config();

import { Register, Login } from "../../controllers/auth/auth.controller";
import { CheckContentType } from "./middlewares/check-content-type";

const authRouter = Router();

authRouter.use(Express.json());

/**
 * Crée un nouvel utilisateur
 */
authRouter.post("/register", CheckContentType, Register);

/**
 * Connexion d'un utilisateur
 */
authRouter.post("/login", CheckContentType, Login);

export default authRouter;
