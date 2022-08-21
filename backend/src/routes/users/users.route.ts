/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import { GetAllUsers, GetUser } from "../../controllers/users/users.controller";
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

export default usersRoute;
