import { atom } from "recoil";
import { JWT_TOKEN_KEY } from "../config/config";

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

export const jwtState = atom<string>({
  key: "jwt-state",
  default: "",
  effects: [localStorageEffect(JWT_TOKEN_KEY)],
});
