/**
 * Type représentant un message retourné par le serveur
 */
export type TypeReturnMessage = {
  /**
   * Le message
   */
  message: string;

  /**
   * Le code d'erreur
   */
  statusCode: number;

  /**
   * Les données retournées
   */
  data?: any;
};
