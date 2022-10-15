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
 * Calendar namespace
 */
export const CALENDAR_NAMESPACE = "/calendar-sync";

/**
 * Longeur maximum d'un titre
 */
export const MAX_LENGTH_EVENT_TITLE = 60;

/**
 * Longeur maximum d'une description
 */
export const MAX_LENGTH_EVENT_DESC = 256;

/**
 * Longeur maximum d'une localisation
 */
export const MAX_LENGTH_EVENT_LOCATION = 256;
