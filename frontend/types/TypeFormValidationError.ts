/**
 * Type d'erreur
 */
export type TypeFormValidationError = {
  /**
   * False si il y a une erreur de définie, sinon true
   */
  empty: boolean;

  /**
   * L'erreur
   */
  error?: string;
};
