import { atom } from "recoil";
import { getRecoil } from "recoil-nexus";

import { API_URLS, EVENTS_LOCALSTORAGE_KEY, JWT_TOKEN_KEY } from "../config/config";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";
import { jwtState } from "./jwt-state";

/**
 * Sauvegarde les événements dans le localStorage.
 * @param key Clé de l'atome
 */
const SaveData =
  (key: string) =>
  ({
    setSelf,
    onSet,
    trigger,
  }: {
    setSelf: (value: any) => void;
    onSet: (callback: (...args: any) => void) => void;
    trigger: "get" | "set";
  }) => {
    if (typeof window !== "undefined" && navigator !== undefined) {
      const savedValue = localStorage.getItem(key);

      if (savedValue) {
        setSelf(JSON.parse(savedValue));
      }

      // S'abonne aux changements de la valeur de l'atome.
      // Appelé à chaque fois que le state est modifié
      onSet((newValue, _, isReset) => {
        if (!navigator.onLine && !getRecoil(jwtState)) {
          localStorage.setItem(key, JSON.stringify(newValue));
        }

        if (isReset) {
          localStorage.removeItem(key);
        }

        // isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const eventsState = atom<TypeEvent[]>({
  key: "events-state",
  default: [],
  // effects: [SaveData(EVENTS_LOCALSTORAGE_KEY)],
});
