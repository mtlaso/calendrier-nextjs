/**
 * Type representant un événement
 */
export type TypeEvent = {
  /**
   * Identifiant de l'événement
   */
  event_id: string;

  /**
   * Date de création de l'événement
   */
  event_creation_date: Date;

  /**
   * Date pour laquelle l'événement a lieu
   */
  event_date: Date;

  /**
   * Le titre de l'événement
   */
  title: string;

  /**
   * Description de l'événement
   */
  description: string;

  /**
   * True si complété
   */
  is_completed: boolean;
};
