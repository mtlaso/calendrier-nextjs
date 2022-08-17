/**
 * Longeur maximum d'un événement
 */
export const MAX_LENGTH_EVENT = 256;

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
  register: "http://localhost:4000/auth/register",
  login: "http://localhost:4000/auth/login",
};
