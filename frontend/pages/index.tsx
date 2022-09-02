import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { io, Socket } from "socket.io-client";

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
import { TypeEvent } from "../types/TypeEvent";
import { ServerToClientEvents, ClientToServerEvents } from "../types/TypeSocketIO";

import { jwtState } from "../state/jwt-state";
import { eventsState } from "../state/events-state";

import { MAX_LENGTH_EVENT } from "../config/config";

import GenerateErrorMessage from "../utils/generate-error-message";
import { LoadCalendar } from "../utils/load-calendar";
import IsCalendarReadyToSync from "../utils/is-calendar-ready-to-sync";

const Home: NextPage = () => {
  const jwt = useRecoilValue(jwtState);

  const calendarEventsSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    "http://localhost:4000/calendar-sync",
    {
      withCredentials: true,
      upgrade: true,
      path: "/calendar-sync",
      auth: {
        Authorization: `${jwt}`,
      },
    }
  );

  const dt = new Date();
  const today = useMemo(() => {
    return new Date();
  }, []);

  // Sync status footer
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<boolean>(false);

  // Socket io calendar sync
  const [newEvents, setNewEvents] = useState<boolean>(false);

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
    console.info("Loading calendar...");
    setIsLoading(true);
    setCalendarSyncStatus(false);

    const [_paddingDays, _days, _dateDisplay] = LoadCalendar(nav);

    setDays(_days as TypeDay[]);
    setPaddingDays(_paddingDays as TypeWeekDays[]);
    setDateDisplay(_dateDisplay as string);

    // Synchroniser les événements avec le calendrier au chargement de la page
    InitSyncCalendar();

    setIsLoading(false);

    return () => {
      calendarEventsSocket.off("connect");
      calendarEventsSocket.off("calendar:sync");
      calendarEventsSocket.off("connect_error");
      calendarEventsSocket.off("disconnect");
    };
  }, [nav]);

  // Envoyer les nouveaux événements à chaque fois qu'on ajoute/modifie/supprime un événement
  useEffect(() => {
    if (!newEvents) {
      return;
    }

    EmitNewEvents();

    setNewEvents(false);
  }, [newEvents]);

  // Initiliaser la synchronisation des événements du calendrier
  const InitSyncCalendar = async () => {
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

      // Écouter pour des l'événement de synchronisation du calendrier
      calendarEventsSocket.on("calendar:sync", (events: TypeEvent[]) => {
        setCalendarEvents([...events]);
        setCalendarSyncStatus(true);
      });

      // Émettre les événements au serveur
      calendarEventsSocket.emit("calendar:sync", { events: calendarEvents, jwt: jwt }, () => {});

      // Évenement de connection
      calendarEventsSocket.on("connect_error", (error: any) => {
        setCalendarSyncStatus(false);
      });

      // Évenement déconnection
      calendarEventsSocket.on("disconnect", (reason) => {
        setCalendarSyncStatus(false);
      });

      // Évenement de reconnection
      calendarEventsSocket.io.on("reconnect", (attemptNumber) => {
        setCalendarSyncStatus(true);
      });

      // Évenement d'erreur
      calendarEventsSocket.io.on("error", (error) => {
        setCalendarSyncStatus(false);
      });
    } catch (err) {
      const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
      console.error("new error: ", errMessage);
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

      calendarEventsSocket.emit("calendar:sync", { events: calendarEvents, jwt: jwt }, () => {});
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
      event_id: uuidv4(),
      event_creation_date: new Date(),
      event_date: new Date(dateOfEvent?.year!, dateOfEvent?.month!, dateOfEvent?.date),
      title: addModalText.trim(),
      is_completed: false,
    };

    // Sauvegarder nouveau évènement
    setCalendarEvents((prevState) => [...prevState, newEvent]); // Rafréchit automatiquement le calendrier grâce à "useRecoilState"

    // Emettre les nouveaux événements au serveur
    setNewEvents(true);

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
    const index = calendarEvents.findIndex((event) => event.event_id === updateModal?.event_id);

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

    // Émettre les nouveaux événements au serveur
    setNewEvents(true);

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
    const index = calendarEvents.findIndex((event) => event.event_id === updateModal?.event_id);

    // Supprimer l'évènement. Calendrier est rafréchit automatiquement grâce à "useRecoilState"
    setCalendarEvents([...calendarEvents.slice(0, index), ...calendarEvents.slice(index + 1)]);

    // Émettre événement à supprimer au serveur
    EmitDeleteEvent(updateModal?.event_id!).finally(() => {
      // Émettre les nouveaux événements au serveur
      setNewEvents(true);
    });
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
          <p>Event created on {new Date(updateModal?.event_creation_date!).toDateString()}</p>

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
      <main>
        {isLoading && <span style={{ color: "white" }}>loading...</span>}
        {!isLoading && (
          <>
            <Calendar
              dateDisplay={dateDisplay}
              paddingDays={paddingDays}
              days={days}
              calendarEvents={calendarEvents}
              onAddEvent={OpenAddEventModal}
              onUpdateEvent={OpenUpdateEventModal}
              today={today}
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
