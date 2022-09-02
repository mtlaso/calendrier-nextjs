import GenerateErrorMessage from "../generate-error-message";
import { API_URLS } from "../../config/config";

/**
 * Retourne le nombre d'événnements que l'utilisateur à créé
 * @param jwt jwt
 * @returns [errMessage, eventsNumber]
 */
export default async function useUserEventsNumber(jwt: string): Promise<[string, number]> {
  let errMessage = "";
  let eventsNumber = 0;
  try {
    // Vérifier jwt
    if (!jwt) {
      errMessage = GenerateErrorMessage("You need to be logged in to access this page");
      return [errMessage, eventsNumber];
    }

    // Récupérer les informations sur les événements de l'utilisateur
    const userReq = await fetch(API_URLS.users.getUserEventsNumber, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${jwt}`,
      },
    });

    const userRes = await userReq.json();

    // Verifier reponse de l'api
    if (userRes?.statusCode !== 200) {
      const errMessage = GenerateErrorMessage("An error occured while fetching user data", `${userRes?.message}`);
      return [errMessage, eventsNumber];
    }

    // Retourner le nombre d'événements
    eventsNumber = userRes.data.count;

    return [errMessage, eventsNumber];
  } catch (err) {
    errMessage = GenerateErrorMessage("An error happend, try again later", `${err}`);
    return [errMessage, eventsNumber];
  }
}
