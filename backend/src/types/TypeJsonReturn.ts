/**
 * Type représentant un objet JSON retourné par le serveur
 */
export type TypeJsonReturn = {
  /**
   * Le message
   */
  message: string;

  /**
   * Le code d'erreur
   *
   */
  statusCode: number;
};
