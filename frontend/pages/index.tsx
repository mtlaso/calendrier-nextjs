import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

import Header from "../components/header/Header";
import GuideModal from "../components/modals/guide_modal/GuideModal";
import Calendar from "../components/calendar/Calendar";
import AddEventModal from "../components/modals/add_modal/AddEventModal";
import AddEventModalContent from "../components/modals/add_modal/AddEventModalContent";
import AddEventModalButtons from "../components/modals/add_modal/AddEventModalButtons";
import UpdateEventModal from "../components/modals/update_modal/UpdateEventModal";
import UpdateEventModalContent from "../components/modals/update_modal/UpdateEventModalContent";
import UpdateEventModalButtons from "../components/modals/update_modal/UpdateEventModalButtons";

import { TypeDay } from "../types/TypeDay";
import { TypeNav } from "../types/TypeNav";
import { TypeWeekDays } from "../types/TypeWeekDays";
import { TypeEvent } from "../types/TypeEvent";

import { LoadCalendar } from "../utils/load-calendar";
import { eventsState } from "../state/events-state";
import { MAX_LENGTH_EVENT } from "../config/config";

const Home: NextPage = () => {
  const dt = new Date();
  const today = useMemo(() => {
    return new Date();
  }, []);

  // Charger les événements du calendrier (Recoil Js)
  const [calendarEvents, setCalendarEvents] = useRecoilState(eventsState);

  const [showAddEventModal, setShowAddEventModal] = useState<"block" | "none">("none");
  const [addModalText, setAddModalText] = useState<string>("");
  const [dateOfEvent, setDateOfEvent] = useState<{
    year: number;
    month: number;
    date: number;
  } | null>(null);

  const [showUpdateEventModal, setShowUpdateEventModal] = useState<"block" | "none">("none");
  const [updateModal, setUpdateModal] = useState<TypeEvent | null>(null);
  const [updateModalText, setUpdateModalText] = useState<string>("");

  const [showInfoModal, setShowInfoModal] = useState<"flex" | "none">("none");

  const [days, setDays] = useState<TypeDay[]>([]);
  const [paddingDays, setPaddingDays] = useState<TypeWeekDays[]>([]);
  const [dateDisplay, setDateDisplay] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nav, setNav] = useState<TypeNav>({
    // Utilisé pour la navigation entre les mois (back et next)
    month: dt.getMonth(),
    year: dt.getFullYear(),
  });

  // Charger le calendrier
  useEffect(() => {
    setIsLoading(true);
    const [_paddingDays, _days, _dateDisplay] = LoadCalendar(nav);

    setDays(_days as TypeDay[]);
    setPaddingDays(_paddingDays as TypeWeekDays[]);
    setDateDisplay(_dateDisplay as string);

    setIsLoading(false);
  }, [nav]);

  // Changer de mois (avancer)
  const ClickNext = () => {
    if (nav.month === 11) {
      setNav({ month: 0, year: nav.year + 1 });
    } else {
      setNav({ month: nav.month + 1, year: nav.year });
    }
  };

  // Changer de mois (reculer)
  const ClickBack = () => {
    if (nav.month === 0) {
      setNav({ month: 11, year: nav.year - 1 });
    } else {
      setNav({ month: nav.month - 1, year: nav.year });
    }
  };

  // Afficher modal AddEventModal
  const OpenAddEventModal = (year: number, month: number, date: number) => {
    // Mettre à jour la date de l'événement
    setDateOfEvent({ year: year, month: month, date: date });

    // Afficher modal AddEventModal
    setShowAddEventModal("block");
  };

  // Afficher modal UpdateEventModal
  const OpenUpdateEventModal = (event: TypeEvent) => {
    // Mettre en mémoire l'événement à modifier
    setUpdateModal(event);

    // Texte du modal
    setUpdateModalText(event.title);

    // Afficher update modal
    setShowUpdateEventModal("block");
  };

  // Créer un évènement
  const CreateEvent = () => {
    // Valider texte
    if (addModalText.trim().length > MAX_LENGTH_EVENT || addModalText.trim().length <= 0) {
      alert(`Text length has to be less than ${MAX_LENGTH_EVENT} characters.`);
      return;
    }

    // Nouveau évènement à ajouter
    const newEvent: TypeEvent = {
      id: uuidv4(),
      eventCreationDate: new Date(),
      eventDate: new Date(dateOfEvent?.year!, dateOfEvent?.month!, dateOfEvent?.date),
      title: addModalText.trim(),
      isCompleted: false,
    };

    // Sauvegarder nouveau évènement
    setCalendarEvents([...calendarEvents, newEvent]); // Rafréchit automatiquement le calendrier grâce à "useRecoilState"

    // Effacer texte
    setAddModalText("");

    // Fermer AddEventModal
    setShowAddEventModal("none");
  };

  // Modifier un évènement
  const UpdateEvent = () => {
    // Valider texte
    if (updateModalText?.trim().length! > MAX_LENGTH_EVENT || updateModalText?.trim().length! <= 0) {
      alert(`Text length has to be less than ${MAX_LENGTH_EVENT} characters.`);
      return;
    }

    // Trouver l'index de l'évènement à modifier
    const index = calendarEvents.findIndex((event) => event.id === updateModal?.id);

    // Évènement modifié
    const updatedEvent = {
      ...updateModal!,
      title: updateModalText?.trim()!,
    };

    // Modifier l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([
      ...calendarEvents.slice(0, Number(index)),
      updatedEvent,
      ...calendarEvents.slice(Number(index) + 1),
    ]);

    // Effacer modal
    setUpdateModal(null);

    // Effacer texte
    setUpdateModalText("");

    // Fermer UpdateEventModal
    setShowUpdateEventModal("none");
  };

  // Supprimer un évènement
  const DeleteEvent = () => {
    // Trouver évènement à supprimer
    const index = calendarEvents.findIndex((event) => event.id === updateModal?.id);

    // Supprimer l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([...calendarEvents.slice(0, index), ...calendarEvents.slice(index + 1)]);
  };

  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header
        clickBack={() => ClickBack()}
        clickNext={() => ClickNext()}
        showInfoModal={() => setShowInfoModal((prev) => (prev === "flex" ? "none" : "flex"))}
      />

      {/* Add event modal */}
      <AddEventModal display={showAddEventModal}>
        <AddEventModalContent>
          <h1>Add event for {`${dateOfEvent?.month}/${dateOfEvent?.date}/${dateOfEvent?.year}`}</h1>
          <textarea
            value={addModalText}
            placeholder="Add New Event"
            autoFocus
            maxLength={MAX_LENGTH_EVENT}
            onChange={(e) => {
              setAddModalText(e.target.value);
            }}
          />
        </AddEventModalContent>
        <hr />

        <AddEventModalButtons>
          <button
            className="button-cancel"
            onClick={() => {
              setShowAddEventModal("none");
            }}>
            Cancel
          </button>
          <button
            onClick={() => {
              CreateEvent();
            }}>
            OK
          </button>
        </AddEventModalButtons>
      </AddEventModal>

      {/* Update event modal */}
      <UpdateEventModal display={showUpdateEventModal}>
        <UpdateEventModalContent>
          <h1>Update event</h1>
          <p>Event created on {new Date(updateModal?.eventCreationDate!).toDateString()}</p>

          <textarea
            value={updateModalText}
            placeholder={updateModalText}
            autoFocus
            maxLength={MAX_LENGTH_EVENT}
            onChange={(e) => {
              setUpdateModalText(e.target.value);
            }}
          />
        </UpdateEventModalContent>
        <hr />
        <UpdateEventModalButtons>
          <button
            className="button-delete"
            onClick={(e) => {
              if (window.confirm("Are you sure you want to delete this event?")) {
                DeleteEvent();
                setShowUpdateEventModal("none");
              }
            }}>
            Delete
          </button>
          <button
            className="button-cancel"
            onClick={() => {
              setShowUpdateEventModal("none");
            }}>
            Cancel
          </button>
          <button
            onClick={() => {
              UpdateEvent();
            }}>
            OK
          </button>
        </UpdateEventModalButtons>
      </UpdateEventModal>

      {/* Guide modal */}
      <GuideModal display={showInfoModal} CloseModal={() => setShowInfoModal("none")} />

      {/* Calendrier */}
      <main id="calendar-root">
        {isLoading ? (
          <span>loading...</span>
        ) : (
          // TODO: passer les events de ce mois seulement, pas tous.
          <Calendar
            dateDisplay={dateDisplay}
            paddingDays={paddingDays}
            days={days}
            calendarEvents={calendarEvents}
            onAddEvent={OpenAddEventModal}
            onUpdateEvent={OpenUpdateEventModal}
            today={today}
          />
        )}
      </main>
    </>
  );
};

export default Home;
