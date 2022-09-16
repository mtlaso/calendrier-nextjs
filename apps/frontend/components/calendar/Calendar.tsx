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
  today,
  headerText,
  paddingDays,
  days,
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

  // Modifier la date sur le header
  useEffect(() => {
    const headerDate = document.getElementById("header-date");
    if (headerDate) {
      headerDate.textContent = headerText;
    }
  }, [headerText]);

  /**
   * Fonction qui permet de render un jour (.container-column-box)
   * @param {number} index Index, car  la fonction retourne une liste
   * @param {TypeDay} day Objet contenant le jour
   */
  function RenderDay(index: number, day: TypeDay) {
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

        {/* header */}
        <p className={`${calendarStyles.box__content_date} ${isToday ? calendarStyles.current_day : ""}`}>{day.date}</p>

        {/* Afficher les événements du jour */}
        <div className={calendarStyles.box__content}>
          {calendarEvents.map((event, index) => {
            return RenderEvents(day, event, index);
          })}
        </div>
      </div>
    );
  }

  /**
   * Render l'événement de ce jour (événement sur plusieurs jours aussi)
   * @param day Objet contenant le jour
   * @param event Objet contenant l'événement
   * @param index Index, car  la fonction retourne une liste
   * @returns {JSX.Element} Retourne un événement JSX
   */
  function RenderEvents(day: TypeDay, event: TypeEvent, index: number = 0) {
    // Titre de l'événement
    const eventSmallTitle = SmallTitle(event.title);

    // Convertir la date UTC de l'événement en local time
    const event_start = new Date(event.event_start);
    const event_end = new Date(event.event_end);

    // Vérifier si l'événement est sur plusieurs jours
    const isEventOnMultipleDays = event_start.getDate() !== event_end.getDate();

    // Vérifier que l'événement est affiché pour le jour auquel il a lieu
    const isEventOnThisDay =
      event_start.getDate() === day.date &&
      event_start.getMonth() === day.month &&
      event_start.getFullYear() === day.year;

    // Afficher les l'événements sur un jour seulement
    if (isEventOnThisDay && !isEventOnMultipleDays) {
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
          className={eventsStyles.event}
          onClick={() => onUpdateEvent(event)}>
          {eventSmallTitle}
          <br />
        </div>
      );
    }

    // Afficher la première partie de l'événement sur plusieurs jours
    if (isEventOnThisDay && isEventOnMultipleDays) {
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
          onClick={() => onUpdateEvent(event)}>
          {eventSmallTitle}
          <br />
        </div>
      );
    }

    // Afficher le reste des événements sur plusieurs jours
    return RenderMultiDaysEvent(day, event, index);
  }

  /**
   * Afficher les événements sur plusieurs jours
   * @param day Le jour
   * @param event L'événement
   * @param index Index, car  la fonction retourne une liste
   */
  const RenderMultiDaysEvent = (day: TypeDay, event: TypeEvent, index: number) => {
    const event_start = new Date(event.event_start);
    const event_end = new Date(event.event_end);

    // Vérifier si l'événement est entre le début et la fin de ce jour
    if (day.date < event_end.getDate() && day.date > event_start.getDate()) {
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
          className={eventsStyles.event__multiple_days__body}
          onClick={() => onUpdateEvent(event)}>
          &#8203;
          <br />
        </div>
      );
    }

    // Vérifier si la fin de l'événement est dans ce jour
    if (
      day.date === event_end.getDate() &&
      day.month === event_end.getMonth() &&
      day.year === event_end.getFullYear()
    ) {
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
          className={eventsStyles.event__multiple_days__body}
          onClick={() => onUpdateEvent(event)}>
          &#8203;
          <br />
        </div>
      );
    }
  };

  return (
    <div className={calendarStyles.container}>
      {/* Contenu... */}

      {/* Colonne dimanche */}
      <div>
        <p className={calendarStyles.column_header}>sun.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "sun") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
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

      {/* Colonne lundi */}
      <div>
        <p className={calendarStyles.column_header}>mon.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "mon") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
        {days.map((day, index) => {
          if (day.dayName !== "Monday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>

      {/* Colonne mardi */}
      <div>
        <p className={calendarStyles.column_header}>tue.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "tue") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
        {days.map((day, index) => {
          if (day.dayName !== "Tuesday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>

      {/* Colonne mercredi */}
      <div>
        <p className={calendarStyles.column_header}>wed.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "wed") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
        {days.map((day, index) => {
          if (day.dayName !== "Wednesday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>

      {/* Colonne jeudi */}
      <div>
        <p className={calendarStyles.column_header}>thu.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "thu") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
        {days.map((day, index) => {
          if (day.dayName !== "Thursday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>

      {/* Colonne vendredi */}
      <div>
        <p className={calendarStyles.column_header}>fri.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "fri") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
        {days.map((day, index) => {
          if (day.dayName !== "Friday") {
            return;
          }

          // Retirer le jour de la liste car on a plus besoin de la render
          days = days.filter((d) => d.date !== day.date);

          return RenderDay(index, day);
        })}
      </div>

      {/* Colonne samedi */}
      <div>
        <p className={calendarStyles.column_header}>sat.</p>

        {/* padding days */}
        {paddingDays.map((day, index) => {
          const padDay = day.slice(0, 3).toLocaleLowerCase(); // Trouver les 3 premières lettres du jours (en anglais)
          if (padDay === "sat") {
            return <div className={calendarStyles.box_empty} key={index}></div>;
          }
        })}

        {/* days */}
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
