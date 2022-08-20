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
 * Nom du cookie content la session
 */
export const SESSION_COOKIE_NAME = "x-session-cookie";

/**
 * Prefix utilisé par reddis-connect pour stocker les sessions dans le cache redis
 */
export const REDIS_CONNECT_SESSION_PREFIX = "x-session-cookie:";
