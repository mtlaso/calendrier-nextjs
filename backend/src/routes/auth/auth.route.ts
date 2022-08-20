/**
 * Authendication route
 */

import Express, { Router } from "express";

import { Register, Login } from "../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.use(Express.json());

/**
 * Crée un nouvel utilisateur
 */
authRouter.post("/register", Register);

/**
 * Connexion d'un utilisateur
 */
authRouter.post("/login", Login);

export default authRouter;
