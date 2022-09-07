import React, { useEffect, useState } from "react";

import { TypeCalendar } from "../../types/TypeCalendar";
import { TypeDay } from "../../types/TypeDay";
import { TypeEvent } from "../../types/TypeEvent";

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
  const [draggedElement, setDraggedElement] = useState<TypeEvent | null>(null);
  const [selectedDragCell, setSelectedDragCell] = useState<TypeDay | null>(null);
  const [isDraggedElementDropped, setIsDraggedElementDropped] = useState<boolean>(false);

  // Drag and drop des événements du calendrier pour changer les dates
  useEffect(() => {
    if (!isDraggedElementDropped) return;

    // Vérifier que l'événement a été bougé
    if (draggedElement && selectedDragCell) {
      const draggedElementDate = new Date(draggedElement.event_date);
      const selectedDragCellDate = new Date(selectedDragCell.year, selectedDragCell.month, selectedDragCell.date);

      // Vérifier que l'événement a été bougé dans une autre cellule
      if (
        draggedElementDate.getDate() === selectedDragCellDate.getDate() &&
        draggedElementDate.getMonth() === selectedDragCellDate.getMonth() &&
        draggedElementDate.getFullYear() === selectedDragCellDate.getFullYear()
      ) {
        return;
      }

      // Vérifier que l'utilisateur est connecté
      if (syncStatus !== "synced") {
        return;
      }

      // Émettre un événement pour mettre à jour l'événement
      onEmitEventDragged(draggedElement, selectedDragCell);

      // Réinitialiser les variables
      setDraggedElement(null);
      setSelectedDragCell(null);
      setIsDraggedElementDropped(false);
    }
  }, [isDraggedElementDropped]);

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
    // Vérifier si c'est la journée d'aujourd'hui, on ajoute la classe "current_day"
    if (day.isCurrentDay && day.month === today.getMonth() && day.year === today.getFullYear()) {
      return (
        // Render le jour dans la colonne .container_column > .container_column_box
        <div
          onDragOverCapture={(e) => {
            e.currentTarget.style.background = "var(--color-lightgrey)";
            setSelectedDragCell(day);
          }}
          onDragLeaveCapture={(e) => {
            e.currentTarget.style.background = "white";
            setSelectedDragCell(null);
          }}
          className={`${calendarStyles.container_column_box} ${calendarStyles.current_day}`}
          key={index}
          onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
          {/* header */}
          <div className={calendarStyles.container_column_box__header}>
            <p>{day.date}</p>
          </div>

          {/* événement */}
          <div className={calendarStyles.container_column_box__content}>
            {/* Afficher les événements du jour */}
            {calendarEvents.map((evnt, index) => {
              return RenderEvent(day, evnt, index);
            })}
          </div>
        </div>
      );
    } else {
      return (
        // Render le jour dans la colonne .container_column > .container_column_box
        <div
          onDragOverCapture={(e) => {
            e.currentTarget.style.background = "var(--color-lightgrey)";
            setSelectedDragCell(day);
          }}
          onDragLeaveCapture={(e) => {
            e.currentTarget.style.background = "white";
            setSelectedDragCell(null);
          }}
          className={calendarStyles.container_column_box}
          key={index}
          onDoubleClick={() => onAddEvent(day.year, day.month, day.date)}>
          {/* header */}
          <div className={calendarStyles.container_column_box__header}>
            <p>{day.date}</p>
          </div>

          {/* événement */}
          <div className={calendarStyles.container_column_box__content}>
            {/* Afficher les événements du jour */}
            {calendarEvents.map((evnt, index) => {
              return RenderEvent(day, evnt, index);
            })}
          </div>
        </div>
      );
    }
  }

  /**
   * Render l'événement de ce jour
   * @param day Objet contenant le jour
   * @param event Objet contenant l'événement
   * @param index Index, car  la fonction retourne une liste
   * @returns {JSX.Element} Retourne un événement JSX
   */
  function RenderEvent(day: TypeDay, event: TypeEvent, index: number = 0) {
    // Titre de l'événement
    const evntTitle = SmallTitle(event.title);

    // Date de l'événement
    const evntDate = new Date(event.event_date);

    // Vérifier que l'événement est affiché pour le jour auquel il a lieu
    if (day.date === evntDate.getDate() && day.month === evntDate.getMonth() && day.year === evntDate.getFullYear()) {
      return (
        <div
          draggable
          onDragStartCapture={(e) => {
            setDraggedElement(event);
            setIsDraggedElementDropped(false);
          }}
          onDragEndCapture={(e) => {
            setIsDraggedElementDropped(true); // Doit être en premier
          }}
          key={index}
          className={eventsStyles.calendar_event}
          onClick={() => onUpdateEvent(event)}>
          {evntTitle}
          <br />
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

        {
          // Retirer les événements qui ont été render car nous avons plus besoin de les render
          // calendarEvents =
        }
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
