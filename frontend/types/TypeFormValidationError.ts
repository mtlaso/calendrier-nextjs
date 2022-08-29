/**
 * Type d'erreur
 */
export type TypeFormValidationError = {
  /**
   * True si il y a une erreur de définie, sinon false
   */
  empty: boolean;

  /**
   * L'erreur
   */
  error?: string;
};
