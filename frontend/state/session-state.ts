import { atom } from "recoil";
import { TypeEvent } from "../types/TypeEvent";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: (value: any) => void; onSet: (callback: (...args: any) => void) => void }) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key);

      // Charger la valeur sauvegardée
      if (savedValue !== null) {
        setSelf(JSON.parse(savedValue));
      }

      // Appelé à chaque fois que le state est modifié
      onSet((newValue, _, isReset) => {
        isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const sessionState = atom({
  key: "session-state",
  default: "",
  effects: [localStorageEffect("session")],
});
