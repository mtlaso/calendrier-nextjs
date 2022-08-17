/**
 * Type representant un événement
 */
export type TypeEvent = {
  /**
   * Identifiant de l'évènement
   */
  id: string;

  /**
   * Date de création de l'évènement
   */
  createdAtDate: string;

  /**
   * Mois de création de l'évènement
   */
  createdAtMonth: string;

  /**
   * Année de création de l'évènement
   */
  createdAtYear: string;

  /**
   * Pour qu'elle date l'évènement a été crée
   */
  createdForDate: string;

  /**
   * Pour qu'elle mois l'évènement a été crée
   */
  createdForMonth: string;

  /**
   * Pour qu'elle année l'évènement a été crée
   */
  createdForYear: string;

  /**
   * Le titre
   */
  title: string;

  /**
   * True si complété
   */
  isCompleted: boolean;
};
