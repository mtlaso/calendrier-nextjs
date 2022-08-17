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
   * Pour quelle date l'évènement a été crée
   */
  createdForDate: string;

  /**
   * Pour quel mois l'évènement a été crée
   */
  createdForMonth: string;

  /**
   * Pour quelle année l'évènement a été crée
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
