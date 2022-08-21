/**
 * Type representant un événement
 */
export type TypeEvent = {
  /**
   * Identifiant de l'événement
   */
  id: string;

  /**
   * Date de création de l'événement
   */
  eventCreationDate: Date;

  /**
   * Date pour laquelle l'événement a lieu
   */
  eventDate: Date;

  /**
   * Le titre de l'événement
   */
  title: string;

  /**
   * True si complété
   */
  isCompleted: boolean;
};
