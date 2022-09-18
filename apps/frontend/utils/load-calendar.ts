import { TypeDay } from "../types/TypeDay";
import { TypeNav } from "../types/TypeNav";
import { TypeWeekDays } from "../types/TypeWeekDays";

/**
 * Jours sur lesquels le calendrier peut commencer
 */
type TypeStartingDaysCalendar = "Saturday" | "Sunday" | "Monday";

/**
 * Retourne les informations nécessaire pour render le calendrier
 * @param nav - Objet TypeNav contenant le mois et l'année
 * @param calendarStartingDay - Jour de la semaine où commence le calendrier
 * @returns Retourne les jours dans le mois ainsi que le titre du header
 * @example
 * const [daysInMonth, headerText] = GetCalendarInfo({ month: 0, year: 2021 });
 */
export default function LoadCalendar(
  nav: TypeNav,
  calendarStartingDay: TypeStartingDaysCalendar = "Sunday"
): [TypeDay[], string] {
  const dt = new Date();
  dt.setFullYear(nav.year);
  dt.setMonth(nav.month);

  const nbDaysInMonth = new Date(nav.year, nav.month + 1, 0).getDate();
  const nbDaysBeforeFirstDayOfMonth = FindNumberOfDaysBeforeFirstDayOfMonth(dt, calendarStartingDay);

  console.log(`nbDaysInMonth: ${nbDaysInMonth}`);
  console.log(`nbDaysBeforeFirstDayOfMonth: ${nbDaysBeforeFirstDayOfMonth}`);

  const daysInMonth: TypeDay[] = [];

  // Ajoute les jours du mois
  for (let i = -nbDaysBeforeFirstDayOfMonth; i < nbDaysInMonth; i++) {
    const today = new Date(dt.getFullYear(), dt.getMonth(), i + 1);
    const dayName = today.toLocaleString("en-CA", { weekday: "long" }) as TypeWeekDays;

    const day: TypeDay = {
      date: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
      dayName: dayName,
      isCurrentDay: today.getDate() === dt.getDate() && today.getMonth() === dt.getMonth(),
      isPadding: today.getMonth() !== dt.getMonth(),
    };

    daysInMonth.push(day);
  }

  // Header texte (barre de navigation)
  const header = `${dt.toLocaleString("en-CA", { month: "long" })} ${dt.getFullYear()}`;

  return [daysInMonth, header];
}

/**
 * Trouve le nombre de jours avant le premier jours du mois en fonction du premier jour de la semaine du calendrier
 * @param dt - Date contenant le mois et l'année à calculer
 * @param calendarStartingDay - Premier jour de la semaine @default "Sunday"
 * @returns Trouve le nombre de jours avant le premier jours du mois
 */
function FindNumberOfDaysBeforeFirstDayOfMonth(dt: Date, calendarStartingDay: TypeStartingDaysCalendar): number {
  const firstDayToStartCalendar = FindFirstDayToStartCalendar(dt, calendarStartingDay); // ex: 28 juin 2021
  const nbOfDaysInMonth = new Date(
    firstDayToStartCalendar.getFullYear(),
    firstDayToStartCalendar.getMonth() + 1,
    0
  ).getDate(); // ex: 30 jours dans le mois de juin 2021

  // Vériier si le premier jours du mois correspond au premier jours du calendrier
  if (firstDayToStartCalendar.getDate() === 1) {
    return 0;
  }

  return nbOfDaysInMonth - firstDayToStartCalendar.getDate() + 1; // ex: 3 jours avant le 1er juillet 2021
}

/**
 * Trouve la date où dois commencer le calendrier en fonction du premier jour de la semaine
 * @param dt - Date contenant le mois et l'année à calculer
 * @param calendarStartingDay Premier jour de la semaine @default "Sunday"
 */
function FindFirstDayToStartCalendar(dt: Date, calendarStartingDay: TypeStartingDaysCalendar): Date {
  const firstDayOfMonth = new Date(dt.getFullYear(), dt.getMonth(), 1);
  const firstDayOfMonthName = firstDayOfMonth.toLocaleString("en-CA", { weekday: "long" }) as TypeWeekDays;

  // Vérifier si le premier jours du mois correspond au premier jour de la semaine du calendrier
  if (firstDayOfMonthName === calendarStartingDay) {
    return firstDayOfMonth;
  }

  // Trouver le premier jours du mois qui correspond au premier jour de la semaine du calendrier
  let i = 0; // pour ne pas faire plus de 10 itérations (pour éviter une boucle infinie)
  while (i <= 10) {
    const day = new Date(dt.getFullYear(), dt.getMonth(), 1 - i);
    const dayName = day.toLocaleString("en-CA", { weekday: "long" }) as TypeWeekDays;

    if (dayName === calendarStartingDay) {
      return day;
    }

    i++;
  }

  // Si on ne trouve pas le premier jours du mois qui correspond au premier jour de la semaine du calendrier
  return firstDayOfMonth;
}
