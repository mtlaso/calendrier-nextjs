import { TypeWeekDays } from "./TypeWeekDays";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";

/**
 * Interface représentant une journée
 */
export type TypeDay = {
  /**
   * Le jour
   */
  date: number;

  /**
   * Le mois
   */
  month: number;
  /**
   * L'année
   */
  year: number;

  /**
   * Le nom du jour
   */
  dayName: TypeWeekDays;

  /**
   * True si c'est aujourd'hui (le jour actuel du mois)
   */
  isCurrentDay: boolean;

  /**
   * True si c'est un padding day (case vide)
   */
  isPadding: boolean;

  /**
   * Événements de la journée
   */
  events?: TypeEvent[];
};
