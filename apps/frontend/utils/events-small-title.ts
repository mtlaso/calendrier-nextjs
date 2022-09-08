/**
 * Retourne le titre abrégé d'un évènement
 * @param title Titre de l'évènement
 * @returns Le titre de l'évènement abrégé
 */
export default function SmallTitle(title: string) {
  if (title.trim().length > 50) {
    return `${title.slice(0, 30)}...`;
  } else {
    return title;
  }
}
