/**
 * Route des utilisateurs
 */

import Express, { Router } from "express";
import {
  GetUser,
  GetUserEventsNumber,
  UpdateUserPassword,
  DeleteUserEvents,
  UpdateFirstDayOfWeek,
} from "../../controllers/users/users.controller";

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

/**
 * Changer le premier jour du calendrier
 */
usersRoute.post("/user/firstDayOfWeek", IsLoggedIn, UpdateFirstDayOfWeek);

/**
 * Supprime tous les événement d'un utilisateur
 */
usersRoute.delete("/user/events", IsLoggedIn, DeleteUserEvents);

export default usersRoute;
