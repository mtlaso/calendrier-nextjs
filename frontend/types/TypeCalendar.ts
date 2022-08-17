import { TypeWeekDays } from "./TypeWeekDays";
import { TypeDay } from "./TypeDay";
import { TypeEvent } from "./TypeEvent";

/**
 * Types du calendrier
 */
export type TypeCalendar = {
  /**
   * Date à afficher sur le header
   */
  dateDisplay: string;

  /**
   * Liste des jours du mois
   */
  days: TypeDay[];

  /**
   * Liste des padding days (cases vides avant le premier jour du mois)
   */
  paddingDays: TypeWeekDays[];

  /**
   * Évènements à afficher sur le calendrier
   */
  calendarEvents: TypeEvent[];

  /**
   * Fonction appelée lors de l'ajout d'un évènement
   */
  onAddEvent: (year: number, month: number, date: number) => void;

  /**
   * Fonction appelée lors de la modification d'un évènement
   */
  onUpdateEvent: (event: TypeEvent) => void;
};
