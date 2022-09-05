import { TypeEvent } from "../types/TypeEvent";

/**
 * Longeur maximum d'un événement
 */
export const MAX_LENGTH_EVENT_TITLE = 60;
export const MAX_LENGTH_EVENT_DESC = 256;

/**
 * Validations des champs lors de la connection/creation d'un utilisateur
 */
export const AUTH_VALIDATION = {
  username_max_length: 30,
  username_min_length: 1,
  password_max_length: 60,
  password_min_length: 8,
};

/**
 * Urls de l'API
 */
export const API_URLS = {
  /**
   * Url de l'API pour l'authentification
   */
  auth: {
    register: "http://localhost:4000/auth/register",
    login: "http://localhost:4000/auth/login",
  },

  /**
   * Url de l'API pour récupérer des informations sur les utilisateurs
   */
  users: {
    getUser: "http://localhost:4000/users/user",
    getUserEventsNumber: "http://localhost:4000/users/user/events",
    updateUserPassword: "http://localhost:4000/users/user/password",
    deleteAllUserEvents: "http://localhost:4000/users/user/events",
  },
};

/**
 * Clé localstorage du Jwt token
 */
export const JWT_TOKEN_KEY: string = "jwt-state";

/**
 * Clé localstorage des événements
 */
export const EVENTS_LOCALSTORAGE_KEY: string = "events-state";

/**
 * Événement par défaut
 */
export const DEFAULT_EVENT: TypeEvent = {
  event_id: "",
  event_creation_date: new Date(),
  event_date: new Date(),
  title: "New Event...",
  description: "New description...",
  is_completed: false,
};

/**
 * Calendar namespace
 */
export const CALENDAR_NAMESPACE = "/calendar-sync";
