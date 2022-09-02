/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import { GetUser, GetUserEventsNumber, UpdateUserPassword } from "../../controllers/users/users.controller";
import IsLoggedIn from "../../middlewares/is-loggedIn";

const usersRoute = Router();

usersRoute.use(Express.json());

/**
 * Récupère un utilisateur selon son id
 */
usersRoute.get("/user", IsLoggedIn, GetUser);

/**
 * Retourne le nombre d'événements que l'utilisateur à créé
 */
usersRoute.get("/user/events", IsLoggedIn, GetUserEventsNumber);

/**
 * Modifie le mot de passe d'un utilisateur
 */
usersRoute.post("/user/password", IsLoggedIn, UpdateUserPassword);

export default usersRoute;
