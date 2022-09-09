import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";

import styles from "./calendar.module.sass";

import CalendarHeader from "../components/calendar-header/CalendarHeader";
import CalendarFooter from "../components/calendar-footer/CalendarFooter";
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
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";

import { TypeCalendarSyncStatus } from "../types/TypeCalendarSyncStatus";

import { jwtState } from "../state/jwt-state";
import { eventsState } from "../state/events-state";

import GenerateErrorMessage from "../utils/generate-error-message";
import LoadCalendar from "../utils/load-calendar";
import IsCalendarReadyToSync from "../utils/is-calendar-ready-to-sync";
import { InitSocketIO } from "../utils/init-socketIO";

import { DEFAULT_EVENT, MAX_LENGTH_EVENT_DESC, MAX_LENGTH_EVENT_TITLE } from "../config/config";

const Home: NextPage = () => {
  // Recoil Js states
  const jwt = useRecoilValue(jwtState);
  const [calendarEvents, setCalendarEvents] = useRecoilState(eventsState);

  const calendarEventsSocket = InitSocketIO(jwt);
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<TypeCalendarSyncStatus>("notsynced"); // Sync status footer
  const [eventsChanged, setEventsChanged] = useState<boolean>(false); // Socket io calendar sync

  const dt = new Date();
  const today = useMemo(() => {
    return new Date();
  }, []);
  7;

  const [showAddEventModal, setShowAddEventModal] = useState<"block" | "none">("none");
  const [newEvent, setNewEvent] = useState<TypeEvent>(DEFAULT_EVENT);
  const [newEventDate, setNewEventDate] = useState<{
    year: number;
    month: number;
    date: number;
  } | null>(null);

  const [showUpdateEventModal, setShowUpdateEventModal] = useState<"block" | "none">("none");
  const [updatedEvent, setUpdatedEvent] = useState<TypeEvent | null>(null);

  const [showInfoModal, setShowInfoModal] = useState<"flex" | "none">("none");

  const [days, setDays] = useState<TypeDay[]>([]);
  const [paddingDays, setPaddingDays] = useState<TypeWeekDays[]>([]);
  const [headerText, setHeaderText] = useState<string>("");

  // Utilisé pour la navigation entre les mois (back et next)
  const [nav, setNav] = useState<TypeNav>({
    month: dt.getMonth(),
    year: dt.getFullYear(),
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Charger le calendrier à chaque fois que la date de navigation change
  useEffect(() => {
    setIsLoading(true);

    const [_paddingDays, _days, _headerText] = LoadCalendar(nav);

    setDays(_days);
    setPaddingDays(_paddingDays);
    setHeaderText(_headerText);

    // Synchroniser les événements avec le calendrier au chargement de la page
    InitCalendarSync();

    setIsLoading(false);

    return () => {
      calendarEventsSocket.off("connect");
      calendarEventsSocket.off("connect_error");
      calendarEventsSocket.off("disconnect");
      calendarEventsSocket.off("calendar:sync");
      calendarEventsSocket.io.off("close");
      calendarEventsSocket.io.off("error");
      calendarEventsSocket.io.off("reconnect");
      calendarEventsSocket.io.off("reconnect_attempt");
      calendarEventsSocket.io.off("reconnect_error");
      calendarEventsSocket.io.off("reconnect_failed");
    };
  }, [nav]);

  // Envoyer les nouveaux événements à chaque fois qu'on ajoute/modifie/supprime un événement
  useEffect(() => {
    if (!eventsChanged) {
      return;
    }

    EmitNewEvents();

    setEventsChanged(false);
  }, [eventsChanged]);

  // Initiliaser la synchronisation des événements du calendrier
  const InitCalendarSync = async () => {
    try {
      const [status, errMessage] = await IsCalendarReadyToSync(jwt);
      if (errMessage.length > 0) {
        throw new Error(errMessage);
      }

      if (!status) {
        throw new Error("Calendar is not ready to sync");
      }

      // Connection au serveur
      calendarEventsSocket.on("connect", () => {});

      // Rejoindre la bonne room pour synchroniser les événements
      calendarEventsSocket.emit("calendar:join", { jwt: jwt });

      // Événement de succès après avoir rejoint une room
      calendarEventsSocket.on("calendar:joined", () => {});

      // Émettre les événements au serveur
      calendarEventsSocket.emit("calendar:sync", { jwt: jwt, events: calendarEvents });

      // Écouter les événement de synchronisation du calendrier (reçus du serveur)
      calendarEventsSocket.on("calendar:sync", (events: TypeEvent[]) => {
        setCalendarEvents(events);
        setCalendarSyncStatus("synced");
      });

      // Évenement de connection
      calendarEventsSocket.on("connect_error", (error: any) => {
        setCalendarSyncStatus("notsynced");
      });

      // Évenement déconnection
      calendarEventsSocket.on("disconnect", (reason) => {
        setCalendarSyncStatus("notsynced");
      });

      // Évenement d'essaie de reconnection
      calendarEventsSocket.io.on("reconnect_attempt", (attemptNumber) => {
        setCalendarSyncStatus("syncing");
      });

      // Évenement de reconnection avec succès
      calendarEventsSocket.io.on("reconnect", (attemptNumber) => {
        setCalendarSyncStatus("synced");
      });

      // Évenement de reconnection échouée
      calendarEventsSocket.io.on("reconnect_failed", () => {
        setCalendarSyncStatus("notsynced");
      });

      // Évenement de reconnection échouée
      calendarEventsSocket.io.on("reconnect_error", (error) => {
        setCalendarSyncStatus("notsynced");
      });

      // Évenement d'erreur
      calendarEventsSocket.io.on("error", (error) => {
        setCalendarSyncStatus("notsynced");
      });

      // Évenement de déconnection
      calendarEventsSocket.io.on("close", (error) => {
        setCalendarSyncStatus("notsynced");
      });
    } catch (err) {
      const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
    }
  };

  // Émettre les nouveaux événments au serveur
  const EmitNewEvents = async () => {
    try {
      const [status, errMessage] = await IsCalendarReadyToSync(jwt);

      if (errMessage.length > 0) {
        throw new Error(errMessage);
      }

      if (!status) {
        throw new Error("Calendar is not ready to sync");
      }

      calendarEventsSocket.emit("calendar:sync", { events: calendarEvents, jwt: jwt });
    } catch (err) {
      const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
    }
  };

  // Émettre un événment à supprimer du serveur
  const EmitDeleteEvent = async (event_id: string) => {
    try {
      const [status, errMessage] = await IsCalendarReadyToSync(jwt);

      if (errMessage.length > 0) {
        throw new Error(errMessage);
      }

      if (!status) {
        throw new Error("Calendar is not ready to sync");
      }

      calendarEventsSocket.emit("calendar:delete", { event_id: event_id, jwt: jwt });
    } catch (err) {
      const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
    }
  };

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
    setNewEventDate({ year: year, month: month, date: date });

    // Afficher modal AddEventModal
    setShowAddEventModal("block");
  };

  // Afficher modal UpdateEventModal
  const OpenUpdateEventModal = (event: TypeEvent) => {
    // Mettre en mémoire l'événement à modifier
    setUpdatedEvent(event);

    // Afficher update modal
    setShowUpdateEventModal("block");
  };

  // Créer un évènement
  const CreateEvent = () => {
    // Valider titre
    if (newEvent.title.trim().length > MAX_LENGTH_EVENT_TITLE || newEvent.title.trim().length <= 0) {
      alert(`Event title has to be less than ${MAX_LENGTH_EVENT_TITLE} characters.`);
      return;
    }

    // Valider desc
    if (newEvent.description.trim().length > MAX_LENGTH_EVENT_DESC || newEvent.title.trim().length <= 0) {
      alert(`Event description has to be less than ${MAX_LENGTH_EVENT_DESC} characters.`);
      return;
    }

    // Nouveau évènement à ajouter
    const eventToAdd: TypeEvent = {
      event_id: uuidv4(),
      event_creation_date: new Date(),
      event_date: new Date(newEventDate?.date!, newEventDate?.month!, newEventDate?.date),
      title: newEvent!.title,
      description: newEvent!.description,
      is_completed: false,
    };

    // Sauvegarder nouveau évènement
    setCalendarEvents((prevState) => [...prevState, eventToAdd]); // Rafréchit automatiquement le calendrier grâce à "useRecoilState"

    // Emettre les nouveaux événements au serveur
    setEventsChanged(true);

    // Fermer AddEventModal
    setShowAddEventModal("none");
  };

  // Modifier un évènement
  const UpdateEvent = () => {
    // Valider titre
    if (
      !updatedEvent ||
      updatedEvent.title.trim().length > MAX_LENGTH_EVENT_TITLE ||
      updatedEvent.title.trim().length <= 0
    ) {
      alert(`Event title has to be less than ${MAX_LENGTH_EVENT_TITLE} characters.`);
      return;
    }

    // Valider desc
    if (
      !updatedEvent ||
      updatedEvent.description.trim().length > MAX_LENGTH_EVENT_DESC ||
      updatedEvent.title.trim().length <= 0
    ) {
      alert(`Event description has to be less than ${MAX_LENGTH_EVENT_DESC} characters.`);
      return;
    }

    // Trouver l'index de l'évènement à modifier
    const index = calendarEvents.findIndex((event) => event.event_id === updatedEvent.event_id);

    // Modifier l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([
      ...calendarEvents.slice(0, Number(index)),
      updatedEvent,
      ...calendarEvents.slice(Number(index) + 1),
    ]);

    // Émettre les nouveaux événements au serveur
    setEventsChanged(true);

    // Effacer modal
    setUpdatedEvent(null);

    // Fermer UpdateEventModal
    setShowUpdateEventModal("none");
  };

  // Supprimer un évènement
  const DeleteEvent = () => {
    // Trouver évènement à supprimer
    const index = calendarEvents.findIndex((event) => event.event_id === updatedEvent?.event_id);

    // Supprimer l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([...calendarEvents.slice(0, index), ...calendarEvents.slice(index + 1)]);

    // Émettre événement à supprimer au serveur
    EmitDeleteEvent(updatedEvent?.event_id!).finally(() => {
      // Rependre les événements du serveur
      setEventsChanged(true);
    });
  };

  // Mettre à jour date de l'évènement (drag and drop des événements sur le calendrier)
  const UpdateEventDate = (event: TypeEvent, newDate: TypeDay) => {
    // Trouver évènement à changer la date
    const index = calendarEvents.findIndex((e) => e.event_id === event.event_id);

    // Modifier la date de l'évènement
    const updatedEventDate = {
      ...event,
      event_date: new Date(newDate.year, newDate.month, newDate.date),
    };

    // Mettre à jour l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([
      ...calendarEvents.slice(0, Number(index)),
      updatedEventDate,
      ...calendarEvents.slice(Number(index) + 1),
    ]);

    // Émettre les nouveaux événements au serveur
    setEventsChanged(true);
  };

  return (
    <div>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Calendar Header */}
      <CalendarHeader
        clickBack={() => ClickBack()}
        clickNext={() => ClickNext()}
        showInfoModal={() => setShowInfoModal((prev) => (prev === "flex" ? "none" : "flex"))}
      />

      {/* Add event modal */}
      <AddEventModal display={showAddEventModal}>
        <AddEventModalContent>
          <h1>
            Create event {new Date(newEventDate?.year!, newEventDate?.month!, newEventDate?.date).toLocaleDateString()}
          </h1>
          <label htmlFor="new-event-title" className={styles.event_modals_label}>
            Title
          </label>
          <input
            className={styles.event_modals_input}
            id="new-event-title"
            value={newEvent?.title ?? ""}
            placeholder="Title"
            autoFocus
            maxLength={MAX_LENGTH_EVENT_TITLE}
            onChange={(e) => {
              setNewEvent((old) => ({ ...old!, title: e.target.value }));
            }}
          />

          <label htmlFor="new-event-desc" className={styles.event_modals_label}>
            Description
          </label>
          <textarea
            className={styles.event_modals_input}
            id="new-event-desc"
            value={newEvent?.description ?? ""}
            placeholder="Description"
            autoFocus
            maxLength={MAX_LENGTH_EVENT_DESC}
            onChange={(e) => {
              setNewEvent((old) => ({ ...old!, description: e.target.value }));
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

          <label htmlFor="update-event-title" className={styles.event_modals_label}>
            New title
          </label>
          <input
            className={styles.event_modals_input}
            id="update-event-title"
            value={updatedEvent?.title ?? ""}
            placeholder={updatedEvent?.title ?? ""}
            autoFocus
            maxLength={MAX_LENGTH_EVENT_TITLE}
            onChange={(e) => {
              setUpdatedEvent((prev) => ({ ...prev!, title: e.target.value }));
            }}
          />
          <label htmlFor="update-event-desc" className={styles.event_modals_label}>
            New description
          </label>
          <input
            className={styles.event_modals_input}
            id="update-event-desc"
            value={updatedEvent?.description ?? ""}
            placeholder={updatedEvent?.description ?? ""}
            autoFocus
            maxLength={MAX_LENGTH_EVENT_DESC}
            onChange={(e) => {
              setUpdatedEvent((prev) => ({ ...prev!, description: e.target.value }));
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
      <main>
        {isLoading && <span style={{ color: "white" }}>loading...</span>}
        {!isLoading && (
          <>
            <Calendar
              headerText={headerText}
              paddingDays={paddingDays}
              days={days}
              calendarEvents={calendarEvents}
              today={today}
              syncStatus={calendarSyncStatus}
              onAddEvent={OpenAddEventModal}
              onUpdateEvent={OpenUpdateEventModal}
              onEmitEventDragged={UpdateEventDate}
            />

            {/* Footer */}
            <CalendarFooter syncStatus={calendarSyncStatus} />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
