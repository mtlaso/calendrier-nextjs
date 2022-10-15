import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";
import { TypeStartingDaysCalendar } from "../types/TypeCalendarStartingDay";
import { EnumWeekDays } from "../types/TypeWeekDays";

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
    updateUserFirstDayOfWeek: "http://localhost:4000/users/user/firstDayOfWeek",
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
  event_start: new Date(),
  event_end: new Date(),
  title: "New Event...",
  description: "New description...",
  is_completed: false,
  location: null,
};

/**
 * Date de début du calendrier par défaut
 */
export const DEFAULT_CALENDAR_STARTING_DAY: TypeStartingDaysCalendar = EnumWeekDays.Sunday;
