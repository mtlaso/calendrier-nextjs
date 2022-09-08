import { TypeDay } from "../types/TypeDay";
import { TypeNav } from "../types/TypeNav";
import { TypeWeekDays } from "../types/TypeWeekDays";

const weekdays: TypeWeekDays[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Retourne le nombre de padding days dans le mois
 * @param day - Objet Date représentant le jour le premier jour du mois
 * @returns {number} Le nombre de padding days
 */
const NumOfPaddingDays = (day: Date): number => {
  const dayName = day.toLocaleDateString("en-us", {
    weekday: "long",
  });

  return weekdays.indexOf(dayName as TypeWeekDays);
};

/**
 * Retourne une liste des jours du mois
 * @param daysInMonth - Le nombre de jours dans le mois
 * @param date - Objet Date contenant le mois et l'année
 */
function GetAllDaysInMonth(daysInMonth: number, date: Date): TypeDay[] {
  const daysArr: TypeDay[] = [];
  const todayDate = new Date().getDate();

  // Trouver les jours du mois
  for (let i = 1; i <= daysInMonth; i++) {
    const today = new Date(date.getFullYear(), date.getMonth(), i);
    const dayName = weekdays[today.getDay()];

    const day: TypeDay = {
      date: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
      dayName: dayName,
      isCurrentDay: today.getDate() === todayDate,
      isPadding: false,
    };

    daysArr.push(day);
  }

  return daysArr;
}

/**
 * Retourne les padding days du mois
 * @param nbPaddingDays - Nombre de padding days dans le mois
 */
function GetPaddingDays(nbPaddingDays: number): TypeWeekDays[] {
  const paddingDaysArr: TypeWeekDays[] = [];

  // Trouver les padding days (nb cases vides)
  for (let i = 0; i < nbPaddingDays; i++) {
    paddingDaysArr.push(weekdays[i]);
  }
  return paddingDaysArr;
}

/**
 * Retourne la date à afficher sur le header du calendrier
 * @param firstDayOfMonth - Objet Date représentant le premier jour du mois
 */
function GetHeaderText(firstDayOfMonth: Date) {
  const month = firstDayOfMonth.toLocaleString("en-CA", {
    month: "long",
  });
  const year = firstDayOfMonth.getFullYear();

  return `${month} ${year}`;
}

/**
 * Retourne les informations nécessaire pour render le calendrier
 * @param {TypeNav} nav Objet contenant le mois et l'année à afficher
 * @returns Retourne le nombre de padding days (cases vides avant le premier jours),
 *          la liste des jours dans le mois et la date à afficher sur le header.
 *         Le tout sous forme d'objet.
 * @example
 *  = [paddingDays, daysInMonth, headerText] = LoadCalendar
 */
export default function LoadCalendar(nav: TypeNav): [TypeWeekDays[], TypeDay[], string] {
  const dt = new Date();

  // Définir le mois et l'année à afficher (à partir de l'objet nav)
  dt.setFullYear(nav.year);
  dt.setMonth(nav.month, 1);

  const year = dt.getFullYear();
  const month = dt.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const nbPaddingDays = NumOfPaddingDays(firstDayOfMonth); // Trouver le nombre de padding days (cases vides avant le premier jour du mois)

  return [
    GetPaddingDays(nbPaddingDays),
    GetAllDaysInMonth(daysInMonth, firstDayOfMonth),
    GetHeaderText(firstDayOfMonth),
  ];
}
