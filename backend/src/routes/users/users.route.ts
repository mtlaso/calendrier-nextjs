/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import { GetAllUsers, GetUserBySessionID } from "../../controllers/users/users.controller";
import IsLoggedIn from "../../middlewares/is-loggedIn";

const usersRoute = Router();

usersRoute.use(Express.json());

/**
 * Récupère tous les utilisateurs
 */
usersRoute.get("/", IsLoggedIn, GetAllUsers);

/**
 * Récupère un utilisateur selon son id
 */
usersRoute.get("/user", IsLoggedIn, GetUserBySessionID);

export default usersRoute;
