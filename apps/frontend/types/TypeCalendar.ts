import { TypeWeekDays } from "./TypeWeekDays";
import { TypeDay } from "./TypeDay";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";
import { TypeCalendarSyncStatus } from "./TypeCalendarSyncStatus";

/**
 * Types du calendrier
 */
export type TypeCalendar = {
  /**
   * Liste des jours du mois
   */
  daysInMonth: TypeDay[];

  /**
   * Date à afficher sur le header
   */
  headerText: string;

  /**
   * Évènements à afficher sur le calendrier
   */
  calendarEvents: TypeEvent[];

  /**
   * Vérifie si le calendrier est synchronisé. Si il est synchronisé, cela veut dire que l'utilisateur est connecté
   */
  syncStatus: TypeCalendarSyncStatus;

  /**
   * Fonction appelée lors de l'ajout d'un événement
   * @param event Événement à ajouter
   */
  onAddEvent: (year: number, month: number, date: number) => void;

  /**
   * Fonction appelée lors de la modification d'un événement
   * @param event Événement à modifier
   */
  onUpdateEvent: (event: TypeEvent) => void;

  /**
   * Fonction appelée quand un événement est déplacé (drag and drop) sur un autre jour pour qu'il change de date
   * @param event Événnement à déplacer
   * @param newDate Nouvelle date de l'évènement
   */
  onEmitEventDragged: (event: TypeEvent, newStartDate: Date) => void;
};
