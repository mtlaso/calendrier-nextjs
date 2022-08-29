import useUserInfo from "./api_requests/useUserInfo";
import GenerateErrorMessage from "./generate-error-message";

/**
 * Vérifie si le calendrier peut être synchronisé si il respecte les conditon suivantes :
 * - L'utilisateur est connecté (jwt valide)
 * - L'utilisateur à une connection internet
 * @param jwt Jwt de l'utilisateur
 * @returns [true, message] si le calendrier peut être synchronisé,
 * sinon [false, errMessage] si le calendrier ne peut pas être synchronisé
 */
export default async function IsCalendarReadyToSync(jwt: string): Promise<[boolean, string]> {
  let errMessage = "";
  let status = false;

  try {
    if (!navigator.onLine || !jwt) {
      return [status, errMessage];
    }

    // Si on peut récupérer les infos de l'utilisateur, le jwt est valide
    const [err, userInfo, _] = await useUserInfo(jwt);
    if (err) {
      return [status, errMessage];
    }

    if (!userInfo) {
      return [status, errMessage];
    }

    status = true;
    return [true, errMessage];
  } catch (err) {
    const errMessage = GenerateErrorMessage("Cannot sync calendar", (err as Error).message);
    return [status, errMessage];
  }
}
