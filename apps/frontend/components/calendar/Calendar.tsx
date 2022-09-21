import React, { useEffect, useState } from "react";

import { TypeCalendar } from "../../types/TypeCalendar";
import { TypeDay } from "../../types/TypeDay";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";

import calendarStyles from "./calendar.module.sass";
import eventsStyles from "./events.module.sass";

import SmallTitle from "../../utils/events-small-title";

/**
 * Component représentant le calendrier
 */
const Calendar = ({
  daysInMonth,
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
  function RenderDay(dayIndex: number, day: TypeDay) {
    const today = new Date();
    const isToday = day.isCurrentDay && day.month === today.getMonth() && day.year === today.getFullYear();

    // Trier les événements si il y en a
    if (day.events) {
      // Trier les événements par ordre croissant
      day.events.sort((a, b) => {
        const aStartDate = new Date(a.event_start);
        const bStartDate = new Date(b.event_start);

        const aEndDate = new Date(a.event_end);
        const bEndDate = new Date(b.event_end);

        // Vérifier si l'événement est sur plusieurs jours
        const isAMultiDaysEvent = aStartDate.getDate() !== aEndDate.getDate();
        const isBMultiDaysEvent = bStartDate.getDate() !== bEndDate.getDate();

        // Si les événements sont sur plusieurs jours, trier par la date de fin
        if (isAMultiDaysEvent && isBMultiDaysEvent) {
          // Si l'événement est tous seul sur la journée, le mettre en premier

          // Trier sur la longeur de l'événement
          const along = aEndDate.getTime() - aStartDate.getTime();
          const blong = bEndDate.getTime() - bStartDate.getTime();

          if (along > blong) {
            return -1;
          }
          if (along < blong) {
            return 1;
          }
        }

        // Si un des deux événements est sur plusieurs jours, celui qui est sur plusieurs jours en premier
        if (isAMultiDaysEvent || isBMultiDaysEvent) {
          return isAMultiDaysEvent ? -1 : 1;
        }

        // Si les deux événements ne sont pas sur plusieurs jours, trier par la date de début
        return aStartDate.getTime() - bStartDate.getTime();
      });
    }

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
        key={dayIndex}
        onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
        {/* Contenu... */}

        {/* date */}
        <p className={`${calendarStyles.box_date} ${isToday ? calendarStyles.current_day : ""}`}>{day.date}</p>

        {/* Si il n y a pas d'événements */}
        {!day.events && <></>}

        {/* Afficher les événements du jour */}
        <div className={calendarStyles.box__content}>
          {/* {day.events && day.events.map((event, index) => RenderEvents(day, event, index))} */}
          {day.events?.map((event, index) => {
            let prevDayEventsLength = 0;
            if (index === 0) {
              prevDayEventsLength = day.events!.length;
            } else {
              prevDayEventsLength = daysInMonth.filter((d) => d.date === day.date - 1)[0].events?.length || 0;
            }
            return RenderEvents(event, new Date(day.year, day.month, day.date), index);
          })}
        </div>
      </div>
    );
  }

  /**
   * Render les événements de ce jour (événements sur plusieurs jours aussi)
   */
  function RenderEvents(event: TypeEvent, dayDate: Date, index: number) {
    const eventSmallTitle = SmallTitle(event.title);

    // Convertir la date UTC de l'événement en local time
    const eventStart = new Date(event.event_start);
    const eventEnd = new Date(event.event_end);

    // Vérifier si l'événement est sur plusieurs jours
    const isMultiDaysEvent = eventStart.getDate() !== eventEnd.getDate();

    // Premier jours de l'événement
    const isEventFirstDay = eventStart.getDate() === dayDate.getDate();

    // Vérifier si l'événement est entre la date de début et la date de fin
    const isEventBetweenStartAndEnd =
      dayDate.getTime() >= eventStart.getTime() && dayDate.getTime() <= eventEnd.getTime();

    if (!isMultiDaysEvent) {
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
            {/* {eventSmallTitle} - {event_start.toLocaleTimeString()} - {event_end.toLocaleTimeString()} */}
            {eventSmallTitle} - {eventStart.toLocaleTimeString()}
          </p>
        </div>
      );
    }

    if (isMultiDaysEvent) {
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
          className={eventsStyles.event__multiple_days__head}
          onClick={() => onUpdateEvent(event)}>
          {isEventFirstDay && (
            <p>
              {eventSmallTitle} - {eventEnd.toLocaleTimeString()}
            </p>
          )}
          {isEventBetweenStartAndEnd && <br />}
        </div>
      );
    }
  }

  return (
    <div className={calendarStyles.container}>
      {/* Afficher les noms de jours */}
      {daysInMonth.map((day, index) => {
        return (
          index < 7 && (
            <p key={index} className={calendarStyles.column_header}>
              {day.dayName}
            </p>
          )
        );
      })}

      {/* Afficher les jours */}
      {daysInMonth.map((day, index) => {
        return RenderDay(index, day);
      })}
    </div>
  );
};

export default Calendar;
