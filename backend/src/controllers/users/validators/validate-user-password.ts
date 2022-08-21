import ApiError from "../../../types/ApiError";
import { AUTH_VALIDATION } from "../../../config/config";

/**
 * Valide les champs lors de la modification du mot de passe
 * @param password Le password
 * @returns ApiError si erreur, false
 */
export function ValidatUserPassword(password: string): boolean {
  password = password.trim();

  if (password.length < AUTH_VALIDATION.password_min_length || password.length > AUTH_VALIDATION.password_max_length) {
    throw new ApiError(
      `Password must be between ${AUTH_VALIDATION.username_min_length} and ${AUTH_VALIDATION.username_max_length} characters`,
      400
    );
  }

  return false;
}
