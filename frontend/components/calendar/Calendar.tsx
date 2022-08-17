import React, { useEffect, useState } from "react";

import { TypeCalendar } from "../../types/TypeCalendar";
import { TypeDay } from "../../types/TypeDay";
import { TypeEvent } from "../../types/TypeEvent";
import { TypeWeekDays } from "../../types/TypeWeekDays";

import calendarStyles from "./calendar.module.sass";
import eventsStyles from "./events.module.sass";

import SmallTitle from "../../utils/events-small-title";

/**
 * Component représentant le calendrier
 *
 * @param {string} dateDisplay La date à afficher sur le header (ex: July 2022)
 * @param {TypeWeekDays[]} paddingDays Liste des jours avant le premier du mois (les cases vides sur le calendrier)
 * @param {TypeDay[]} days Liste des jours dans un mois donné
 * @param {TypeEvent[]} calendarEvents Évènements de calendrier de l'utilisateur
 * @param {Function} onAddEvent Fonction exécutée pour l'ajout d'un évènement
 * @param {Function} onUpdateEvent Fonction exécutée pour modifier un évènement
 * @param {Function} onDeleteEvent Fonction exécutée pour supprimer un évènement
 *
 */
/** */
const Calendar = ({ dateDisplay, paddingDays, days, calendarEvents, onAddEvent, onUpdateEvent }: TypeCalendar) => {
  const today = new Date();

  // Setup la date sur le header
  useEffect(() => {
    const headerDate = document.getElementById("header-date");
    if (headerDate) {
      headerDate.textContent = dateDisplay;
    }
  }, [dateDisplay]);

  return (
    <div id="container" className={calendarStyles.container}>
      <div id="container-column-sun" className={calendarStyles.container_column}>
        <p>sun.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "sun") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}

        {days.map((day, index) => {
          return RenderDay(index, day, "Sunday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-mon" className={calendarStyles.container_column}>
        <p>mon.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "mon") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}
        {days.map((day, index) => {
          return RenderDay(index, day, "Monday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-tue" className={calendarStyles.container_column}>
        <p>tue.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "tue") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}

        {days.map((day, index) => {
          return RenderDay(index, day, "Tuesday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-wed" className={calendarStyles.container_column}>
        <p>wed.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "wed") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}

        {days.map((day, index) => {
          return RenderDay(index, day, "Wednesday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-thu" className={calendarStyles.container_column}>
        <p>thu.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "thu") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}

        {days.map((day, index) => {
          return RenderDay(index, day, "Thursday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-fri" className={calendarStyles.container_column}>
        <p>fri.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "fri") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}

        {days.map((day, index) => {
          return RenderDay(index, day, "Friday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
      <div id="container-column-sat" className={calendarStyles.container_column}>
        <p>sat.</p>
        <hr />
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "sat") {
            return <div className={calendarStyles.container_column_box_empty} key={index}></div>;
          }
        })}
        {days.map((day, index) => {
          return RenderDay(index, day, "Saturday", today, calendarEvents, onAddEvent, onUpdateEvent);
        })}
      </div>
    </div>
  );
};

export default Calendar;

function RenderDay(
  index: number,
  day: TypeDay,
  dayName: TypeWeekDays,
  today: Date,
  calendarEvents: TypeEvent[],
  onAddEvent: (year: number, month: number, date: number) => void,
  onUpdateEvent: (event: TypeEvent) => void
) {
  if (day.dayName === dayName) {
    if (day.isCurrentDay && day.month === today.getMonth()) {
      return (
        <div className={`${calendarStyles.container_column_box} ${calendarStyles.current_day}`} key={index}>
          <p>{day.date}</p>
          {calendarEvents.map((evnt, index) => {
            const currentDay = day.date;
            const currentMonth = day.month; // Mois actuel
            const currentYear = day.year; // Année actuelle

            const evntTitle = SmallTitle(evnt.title);

            if (
              currentDay === Number(evnt.createdForDate) &&
              currentMonth === Number(evnt.createdForMonth) &&
              currentYear === Number(evnt.createdForYear)
            ) {
              return (
                <div key={index} className={eventsStyles.calendar_event} onClick={() => onUpdateEvent(evnt)}>
                  {evntTitle}
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <div
          className={calendarStyles.container_column_box}
          key={index}
          onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
          <p>{day.date}</p>
          {calendarEvents.map((evnt, index) => {
            const currentDay = day.date;
            const currentMonth = day.month; // Mois actuel
            const currentYear = day.year; // Année actuelle

            const evntTitle = SmallTitle(evnt.title);

            if (
              currentDay === Number(evnt.createdForDate) &&
              currentMonth === Number(evnt.createdForMonth) &&
              currentYear === Number(evnt.createdForYear)
            ) {
              return (
                <div key={index} className={eventsStyles.calendar_event} onClick={() => onUpdateEvent(evnt)}>
                  {evntTitle}
                </div>
              );
            }
          })}
        </div>
      );
    }
  }
}
