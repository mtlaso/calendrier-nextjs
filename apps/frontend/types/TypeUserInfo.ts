/**
 * Type représentant les informations d'un utilisateur
 */
export type TypeUserInfo = {
  /**
   * Identifiateur de l'utilisateur
   */
  user_id: string;

  /**
   * Nom d'utilisateur
   */
  username: string;

  /**
   * Date de création du compte de l'utilisateur
   */
  created_on: Date;

  /**
   * Date de dernière connexion de l'utilisateur
   */
  last_login: Date;

  /**
   * Jour de début de semaine
   * MONDAY ou SUNDAY
   * @default MONDAY
   */
  week_start_day: "MONDAY" | "SUNDAY";
};
