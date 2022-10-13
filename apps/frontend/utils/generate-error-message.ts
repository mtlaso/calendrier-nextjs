/**
 * Génére un message d'erreur. Affiche le "reasonMessage" seulement si NODE_ENV est en "development"
 * @param genericErrorMessage Message générique d'erreur
 * @param reasonMessage Raison de l'erreur
 * @returns Le message d'erreur
 */
export default function GenerateErrorMessage(genericErrorMessage: string, reasonMessage?: string): string {
  if (process.env.NODE_ENV === "development") {
    return `${genericErrorMessage}${reasonMessage ? `: ${reasonMessage}` : ""}`;
  } else {
    return genericErrorMessage;
  }
}
