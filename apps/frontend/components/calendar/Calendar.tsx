import React, { useEffect, useState } from "react";

import { TypeCalendar } from "../../types/TypeCalendar";
import { TypeDay } from "../../types/TypeDay";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";
import { TypeWeekDays } from "../../types/TypeWeekDays";

import calendarStyles from "./calendar.module.sass";
import eventsStyles from "./events.module.sass";

import SmallTitle from "../../utils/events-small-title";

/**
 * Component représentant le calendrier
 */
const Calendar = ({
  daysInMonth,
  // headerText,
  calendarEvents,
  syncStatus,
  onAddEvent,
  onUpdateEvent,
  onEmitEventDragged,
}: TypeCalendar) => {
  // Événement qui est bougé
  const [draggedEvent, setDraggedEvent] = useState<TypeEvent | null>(null);
  const [isDraggedEventDropped, setIsDraggedEventDropped] = useState<boolean>(false);
  const [selectedDragCell, setSelectedDragCell] = useState<TypeDay | null>(null);

  // Drag and drop des événements du calendrier pour changer les dates
  useEffect(() => {
    if (!isDraggedEventDropped) return;

    // Vérifier que l'événement a été bougé
    if (!draggedEvent || !selectedDragCell) return;

    const eventStartDate = new Date(draggedEvent.event_start);
    const eventEndDate = new Date(draggedEvent.event_end);
    const cellDate = new Date(selectedDragCell.year, selectedDragCell.month, selectedDragCell.date);

    // Vérifier que l'événement a été bougé dans une autre cellule
    if (
      eventStartDate.getDate() === cellDate.getDate() &&
      eventStartDate.getMonth() === cellDate.getMonth() &&
      eventStartDate.getFullYear() === cellDate.getFullYear()
    ) {
      return;
    }

    // Vérifier que l'utilisateur est connecté
    if (syncStatus !== "synced") {
      return;
    }

    // Émettre un événement pour mettre à jour l'événement
    const updatedDate = new Date(selectedDragCell.year, selectedDragCell.month, selectedDragCell.date);
    onEmitEventDragged(draggedEvent, updatedDate);

    // Réinitialiser les variables
    setDraggedEvent(null);
    setSelectedDragCell(null);
    setIsDraggedEventDropped(false);
  }, [isDraggedEventDropped]);

  /**
   * Fonction qui permet de render un jour (.container-column-box)
   * @param {number} index Index, car  la fonction retourne une liste
   * @param {TypeDay} day Objet contenant le jour
   */
  function RenderDay(index: number, day: TypeDay) {
    const today = new Date();
    const isToday = day.isCurrentDay && day.month === today.getMonth() && day.year === today.getFullYear();

    return (
      <div
        onDragOverCapture={(e) => {
          e.currentTarget.style.background = "var(--color-lightgrey)";
          setSelectedDragCell(day);
        }}
        onDragLeaveCapture={(e) => {
          e.currentTarget.style.background = "var(--color-black)";
          setSelectedDragCell(null);
        }}
        className={`${calendarStyles.box}`}
        key={index}
        onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
        {/* Contenu... */}

        {/* date */}
        <p className={`${calendarStyles.box_date} ${isToday ? calendarStyles.current_day : ""}`}>{day.date}</p>

        {/* Afficher les événements du jour */}
        <div className={calendarStyles.box__content}>
          {day.events !== undefined && day.events.map((event, index) => RenderEvents(day, event, index))}
        </div>
      </div>
    );
  }

  /**
   * Render les événements de ce jour (événements sur plusieurs jours aussi)
   * @param day Objet contenant le jour
   * @param event Objet contenant l'événement
   * @param index Index, car  la fonction retourne une liste
   * @returns {JSX.Element} Retourne un événement JSX
   */
  function RenderEvents(day: TypeDay, event: TypeEvent, index: number) {
    // Titre de l'événement
    const eventSmallTitle = SmallTitle(event.title);

    // Convertir la date UTC de l'événement en local time
    const event_start = new Date(event.event_start);
    const event_end = new Date(event.event_end);

    // Vérifier si l'événement est sur plusieurs jours
    const isEventOnMultipleDays = event_start.getDate() !== event_end.getDate();

    // Vérifier que l'événement est affiché pour le jour auquel il a lieu
    const isEventFirstDay =
      event_start.getDate() === day.date &&
      event_start.getMonth() === day.month &&
      event_start.getFullYear() === day.year;

    // Vérifier que l'événement est affiché pour le dernier jour auquel il a lieu
    const isEventLastDay = isEventOnMultipleDays && event_end.getDate() === day.date;

    // Vérifier que l'événement est affiché pour un jour entre le premier et le dernier jour
    const isInbetweenEvent = isEventOnMultipleDays && !isEventFirstDay && !isEventLastDay;

    // Vérifier que le jours contient plusieurs événements
    const isMultipleEventsOnDay = day.events && day.events.length > 1;

    const isEventStartedEarlier = event_start.getDate() < day.date;

    // Afficher les l'événements sur un jour seulement
    if (!isEventOnMultipleDays) {
      return (
        <div
          draggable
          onDragStartCapture={() => {
            setDraggedEvent(event);
            setIsDraggedEventDropped(false);
          }}
          onDragEndCapture={() => {
            setIsDraggedEventDropped(true); // Doit être en premier
          }}
          key={event.event_id}
          className={eventsStyles.event}
          onClick={() => onUpdateEvent(event)}>
          <p>
            {eventSmallTitle} - {event_start.toLocaleTimeString()}
          </p>
        </div>
      );
    }

    // Afficher la première partie de l'événement sur plusieurs jours
    if (isEventOnMultipleDays) {
      return (
        <div
          draggable
          onDragStartCapture={() => {
            setDraggedEvent(event);
            setIsDraggedEventDropped(false);
          }}
          onDragEndCapture={() => {
            setIsDraggedEventDropped(true); // Doit être en premier
          }}
          key={index}
          className={eventsStyles.event__multiple_days__head}
          onClick={() => onUpdateEvent(event)}
          // style={isEventLastDay ? { background: "red" } : {}}
        >
          {isEventFirstDay && eventSmallTitle}
          <br />
        </div>
      );
    }
  }

  return (
    <div className={calendarStyles.container}>
      {/* Afficher les noms de jours */}
      {daysInMonth.map((day, index) => {
        return index < 7 && <p className={calendarStyles.column_header}>{day.dayName}</p>;
      })}

      {/* Afficher les jours */}
      {daysInMonth.map((day, index) => {
        return RenderDay(index, day);
      })}
    </div>
  );
};

export default Calendar;
