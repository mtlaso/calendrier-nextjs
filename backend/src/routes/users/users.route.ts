/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import { GetAllUsers, GetUser, UpdateUserPassword } from "../../controllers/users/users.controller";
import IsLoggedIn from "../../middlewares/is-loggedIn";

const usersRoute = Router();

usersRoute.use(Express.json());

/**
 * Récupère tous les utilisateurs
 */
// usersRoute.get("/", IsLoggedIn, GetAllUsers);

/**
 * Récupère un utilisateur selon son id
 */
usersRoute.get("/user", IsLoggedIn, GetUser);

/**
 * Modifie le mot de passe d'un utilisateur
 */
usersRoute.post("/user", IsLoggedIn, UpdateUserPassword);

export default usersRoute;
