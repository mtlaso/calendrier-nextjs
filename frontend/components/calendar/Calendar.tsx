import React, { useEffect, useState } from "react";

import { TypeCalendar } from "../../types/TypeCalendar";
import { TypeDay } from "../../types/TypeDay";
import { TypeEvent } from "../../types/TypeEvent";
import { TypeWeekDays } from "../../types/TypeWeekDays";

import calendarStyles from "./calendar.module.sass";
import eventsStyles from "./events.module.sass";

import SmallTitle from "../../utils/events-small-title";
import { useRecoilState, useRecoilValue } from "recoil";
import { eventsState } from "../../state/events-state";

/**
 * Component représentant le calendrier
 *
 * @param {string} dateDisplay La date à afficher sur le header (ex: July 2022)
 * @param {TypeWeekDays[]} paddingDays Liste des jours avant le premier du mois (les cases vides sur le calendrier)
 * @param {TypeDay[]} days Liste des jours dans un mois donné
 * @param {TypeEvent[]} calendarEvents Évènements de calendrier de l'utilisateur
 * @param {Function} onAddEvent Fonction appelée quand un événement va être ajouté
 * @param {Function} onUpdateEvent Fonction appelée quand un événement va être modifié
 */
const Calendar = ({
  today,
  dateDisplay,
  paddingDays,
  days,
  calendarEvents,
  onAddEvent,
  onUpdateEvent,
}: TypeCalendar) => {
  // Modifier la date sur le header
  useEffect(() => {
    const headerDate = document.getElementById("header-date");
    if (headerDate) {
      headerDate.textContent = dateDisplay;
    }
  }, [dateDisplay]);

  /**
   * Fonction qui permet de render un jour (.container-column-box)
   * @param {number} index Index, car  la fonction retourne une liste
   * @param {TypeDay} day Objet contenant le jour
   */
  function RenderDay(index: number, day: TypeDay) {
    // Vérifier si c'est la journée d'aujourd'hui, on ajoute la classe "current_day"
    if (day.isCurrentDay && day.month === today.getMonth() && day.year === today.getFullYear()) {
      return (
        // Render le jour dans la colonne .container_column > .container_column_box
        <div
          className={`${calendarStyles.container_column_box} ${calendarStyles.current_day}`}
          key={index}
          onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
          <p>{day.date}</p>

          {/* Retirer journée de la liste car nous avons plus besoin de la render */}

          {/* Afficher les événements du jour */}
          {calendarEvents.map((evnt, index) => {
            const dayDate = day.date;
            const dayMonth = day.month; // Mois actuel
            const dayYear = day.year; // Année actuelle

            // Titre de l'événement
            const evntTitle = SmallTitle(evnt.title);

            // Date de l'événement
            const evntDate = new Date(evnt.event_date);

            // Vérifier que l'événement est affiché pour le jour auquel il a lieu
            if (
              dayDate === evntDate.getDate() &&
              dayMonth === evntDate.getMonth() &&
              dayYear === evntDate.getFullYear()
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
        // Render le jour dans la colonne .container_column > .container_column_box
        <div
          className={calendarStyles.container_column_box}
          key={index}
          onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
          <p>{day.date}</p>

          {/* Retirer journée de la liste car nous avons plus besoin de la render */}

          {/* Afficher les événements du jour */}
          {calendarEvents.map((evnt, index) => {
            const dayDate = day.date;
            const dayMonth = day.month; // Mois actuel
            const dayYear = day.year; // Année actuelle

            // Titre de l'événement
            const evntTitle = SmallTitle(evnt.title);

            // Date de l'événement
            const evntDate = new Date(evnt.event_date);

            // Vérifier que l'événement est affiché pour le jour auquel il a lieu
            if (
              dayDate === evntDate.getDate() &&
              dayMonth === evntDate.getMonth() &&
              dayYear === evntDate.getFullYear()
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
          // Vérifier si le jour qui va être rendu fait parti de cette colonne
          if (day.dayName !== "Sunday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Monday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Tuesday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Wednesday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Thursday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Friday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
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
          if (day.dayName !== "Saturday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>
    </div>
  );
};

export default Calendar;
