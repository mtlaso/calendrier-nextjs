import useUserInfo from "./api_requests/useUserInfo";
import GenerateErrorMessage from "./generate-error-message";

/**
 * Vérifie si le calendrier peut être synchronisé si il respecte les conditon suivantes :
 * - L'utilisateur à une connection internet
 * - L'utilisateur est connecté (jwt valide)
 * @param jwt Jwt de l'utilisateur
 * @returns [true, ""] si le calendrier peut être synchronisé,
 * sinon [false, errMessage] si le calendrier ne peut pas être synchronisé
 */
export default async function IsCalendarReadyToSync(jwt: string): Promise<[boolean, string]> {
  let errMessage = "";
  let status = false;

  try {
    if (!navigator.onLine || !jwt) {
      errMessage = GenerateErrorMessage("You're not connected to the internet or you're not logged in");
      return [status, errMessage];
    }

    // Si on peut récupérer les infos de l'utilisateur, le jwt est valide
    const [err, userInfo] = await useUserInfo(jwt);
    if (err) {
      errMessage = GenerateErrorMessage("You're not logged in");
      return [status, errMessage];
    }

    if (!userInfo) {
      errMessage = GenerateErrorMessage("Cannot retrieve user info");
      return [status, errMessage];
    }

    status = true;
    return [status, errMessage];
  } catch (err) {
    const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
    return [status, errMessage];
  }
}
