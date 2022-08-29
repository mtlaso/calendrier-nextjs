/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import { GetUser, UpdateUserPassword, GetUserEvents, UpdateUserEvents } from "../../controllers/users/users.controller";
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
usersRoute.post("/user/password", IsLoggedIn, UpdateUserPassword);

/**
 * Retourne les événements d'un utilisateur
 */
usersRoute.get("/user/events", IsLoggedIn, GetUserEvents);

/**
 * Met à jour les événements d'un utilisateur
 */
usersRoute.post("/user/events", IsLoggedIn, UpdateUserEvents);

export default usersRoute;
