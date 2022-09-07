import { TypeWeekDays } from "./TypeWeekDays";
import { TypeDay } from "./TypeDay";
import { TypeEvent } from "./TypeEvent";
import { TypeCalendarSyncStatus } from "./TypeCalendarSyncStatus";

/**
 * Types du calendrier
 */
export type TypeCalendar = {
  /**
   * Garde en mémoire la date d'aujourd'hui
   */
  today: Date;

  /**
   * Date à afficher sur le header
   */
  headerText: string;

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
   * Vérifie si le calendrier est synchronisé. Si il est synchronisé, cela veut dire que l'utilisateur est connecté
   */
  syncStatus: TypeCalendarSyncStatus;

  /**
   * Fonction appelée lors de l'ajout d'un évènement
   */
  onAddEvent: (year: number, month: number, date: number) => void;

  /**
   * Fonction appelée lors de la modification d'un évènement
   */
  onUpdateEvent: (event: TypeEvent) => void;

  /**
   * Fonction appelée quand un événement est déplacé (drag and drop) sur un autre jour pour qu'il change de date
   */
  onEmitEventDragged: (event: TypeEvent, newStartDate: TypeDay) => void;
};
