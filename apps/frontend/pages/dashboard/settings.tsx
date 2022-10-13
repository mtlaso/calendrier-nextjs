import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineInfoCircle, AiFillCloseCircle, AiOutlineCalendar } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ModalContainer from "../../components/modals/ModalContainer";

import { API_URLS, AUTH_VALIDATION } from "../../config/config";
import { jwtState } from "../../state/jwt-state";
import useUserInfo from "../../utils/api_requests/useUserInfo";
import GenerateErrorMessage from "../../utils/generate-error-message";

import { TypeUserInfo } from "../../types/TypeUserInfo";
import { TypeFormValidationError } from "../../types/TypeFormValidationError";

import styles from "./dashboard.module.sass";
import { eventsState } from "../../state/events-state";

export default function Settings() {
  const router = useRouter();
  const [jwt, setJwt] = useRecoilState(jwtState);
  const setCalendarEvents = useSetRecoilState(eventsState);

  const [loading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<null | TypeUserInfo>(null);

  const [showUserInfoModal, setShowUserInfoModal] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const [oldPasswordValidationError, setOldPasswordValidationError] = useState<TypeFormValidationError>();
  const [newPasswordValidationError, setNewPasswordValidationError] = useState<TypeFormValidationError>();

  // Champs utilisés pour afficher le status et le message de confirmation/erreur lors de la modification du mot de passe
  const [passwordUpdatedStatus, setPasswordUpdatedStatus] = useState<"success" | "error" | null>(null);
  const [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState<string>("");

  const [calendarFirstDayStatus, setCalendarFirstDayStatus] = useState<"success" | "error" | null>(null);
  const [calendarFirstDayMessage, setCalendarFirstDayMessage] = useState<string>("");

  const [deleteEventsStatus, setDeleteEventsStatus] = useState<"success" | "error" | null>(null);
  const [deleteEventsMessage, setDeleteEventsMessage] = useState<string>("");

  // Charger les informations sur l'utilisateur
  useEffect(() => {
    const LoadUserData = async () => {
      const [err, userInfo] = await useUserInfo(jwt);

      if (err.length > 1) {
        // Supprimer le jwt de l'utilisateur
        setJwt("");

        // Rediriger vers la page de connexion
        router.push(`/auth/login?message=${err}`);
        return;
      }

      setUserInfo(userInfo);
      setIsLoading(false);
    };

    setIsLoading(true);
    LoadUserData();
  }, []);

  // Valider le formulaire de modification du mot de passe
  const ValidatePasswordForm = async () => {
    // Vider les erreurs
    setOldPasswordValidationError({ empty: true });
    setNewPasswordValidationError({ empty: true });

    setPasswordUpdatedStatus(null);
    setPasswordUpdatedMessage("");

    // Valider ancien mot de passe
    if (
      oldPassword.length < AUTH_VALIDATION.password_min_length ||
      oldPassword.length > AUTH_VALIDATION.password_max_length
    ) {
      setOldPasswordValidationError({
        empty: false,
        error: `Password must be between ${AUTH_VALIDATION.password_min_length} and ${AUTH_VALIDATION.password_max_length} characters.`,
      });
    }

    // Valider nouveau mot de passe
    if (
      newPassword.length < AUTH_VALIDATION.password_min_length ||
      newPassword.length > AUTH_VALIDATION.password_max_length
    ) {
      setNewPasswordValidationError({
        empty: false,
        error: `Password must be between ${AUTH_VALIDATION.password_min_length} and ${AUTH_VALIDATION.password_max_length} characters.`,
      });
    }

    if (oldPasswordValidationError?.empty && newPasswordValidationError?.empty) {
      // Enovyer la requete de modification du mot de passe
      SendUpdatePasswordForm();
    }
  };

  // Envoyer le formulaire
  const SendUpdatePasswordForm = async () => {
    try {
      const body = JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword });

      const req = await fetch(API_URLS.users.updateUserPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwt}`,
        },
        body: body,
      });

      const res = await req.json();

      if (res.statusCode !== 200) {
        setPasswordUpdatedStatus("error");
        const errMessage = GenerateErrorMessage("An error occured while updating your password.", res.message);
        setPasswordUpdatedMessage(errMessage);
        return;
      }

      setPasswordUpdatedStatus("success");
      setPasswordUpdatedMessage("Password updated successfully.");
    } catch (error) {
      setPasswordUpdatedStatus("error");
      const errMessage = GenerateErrorMessage("An error occured while creating your account", (error as Error).message);
      setPasswordUpdatedMessage(errMessage);
    }
  };

  // Changer le premier jour de le semaine
  const ChangeFirstDayOfWeek = async (day: "SUNDAY" | "MONDAY") => {
    try {
      // Vider champs
      setCalendarFirstDayMessage("");
      setCalendarFirstDayStatus(null);

      // Vérifier si le jour est différent de celui actuel
      if (userInfo?.week_start_day === day) return;

      const body = JSON.stringify({ week_start_day: day });

      // Envoyer requête
      const req = await fetch(API_URLS.users.updateUserFirstDayOfWeek, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwt}`,
        },
        body: body,
      });

      // Récupérer la réponse
      const res = await req.json();

      // Vérifier si la requête a réussi
      if (res.statusCode !== 200) {
        const errMessage = GenerateErrorMessage(
          "An error occured while changing the starting day of your calendar.",
          res.message
        );
        setCalendarFirstDayMessage(errMessage);
        setCalendarFirstDayStatus("error");
      }

      // Message de succès
      setCalendarFirstDayMessage(`Starting day of your calendar changed successfully, set to ${day.toLowerCase()}.`);
      setCalendarFirstDayStatus("success");

      // Changer la valeur dans le state
      setUserInfo({ ...userInfo!, week_start_day: day });
    } catch (err) {
      const errMessage = GenerateErrorMessage(
        "An error occured while chaning the first day of the calendar",
        (err as Error).message
      );
      alert(errMessage);
    }
  };

  // Supprimer le compte de l'utilisateur
  const DeleteAllUserEvents = async () => {
    try {
      setDeleteEventsMessage("");
      setDeleteEventsStatus(null);

      const req = await fetch(API_URLS.users.deleteAllUserEvents, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwt}`,
        },
      });

      const res = await req.json();

      if (res.statusCode !== 200) {
        setDeleteEventsStatus("error");
        const errMessage = GenerateErrorMessage("An error occured while deleting your events.", res.message);
        setDeleteEventsMessage(errMessage);
        return;
      }

      setDeleteEventsStatus("success");
      setDeleteEventsMessage("All your events have been deleted.");

      // Supprimer événements localement
      setCalendarEvents([]);
    } catch (err) {
      const errMessage = GenerateErrorMessage("An error occured while deleting your events", (err as Error).message);
      alert(errMessage);
    }
  };

  if (loading) {
    return <span style={{ color: "white" }}>loading...</span>;
  }

  return (
    <DashboardLayout title="Settings">
      <div className={styles.content_container}>
        <h2>General</h2>
        {/* Cartes */}
        <div className={styles.cards_container}>
          {/* User info */}
          <div className={styles.card} onClick={(e) => setShowUserInfoModal(!showUserInfoModal)}>
            <div className={styles.card__header}>
              <h3>User info</h3>
              <span>
                <AiOutlineUser size={25} />
              </span>
            </div>

            <p>Username : {userInfo?.username}</p>
            <p>Password : *******</p>
          </div>

          {/* Changer premier jour du calendrier */}
          <div className={`${styles.card} ${styles.card_noaction}`}>
            <div className={styles.card__header}>
              <h3>Week starting day</h3>
              <span>
                <AiOutlineCalendar size={25} />
              </span>
            </div>

            <select
              value={userInfo?.week_start_day === "SUNDAY" ? "SUNDAY" : "MONDAY"}
              onChange={(e) => {
                ChangeFirstDayOfWeek(e.currentTarget.value as "SUNDAY" | "MONDAY");
              }}>
              <option value="SUNDAY">Sunday</option>
              <option value="MONDAY">Monday</option>
            </select>
          </div>

          {/* Other info */}
          <div className={`${styles.card} ${styles.card_noaction}`}>
            <div className={styles.card__header}>
              <h3>Other info</h3>
              <span>
                <AiOutlineInfoCircle size={25} />
              </span>
            </div>
            <p>
              Account created on{" "}
              <time dateTime={userInfo?.created_on.toString()}>{userInfo?.created_on.toString().split("T")[0]}</time>
            </p>
            <p>
              Last login :{" "}
              <time dateTime={userInfo?.last_login.toString()}>{userInfo?.last_login.toString().split("T")[0]}</time>
            </p>
          </div>

          {/* Modal changement mot de passe */}
          <ModalContainer display={showUserInfoModal}>
            <form
              className={styles.form}
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                ValidatePasswordForm();
              }}>
              <div className={styles.card}>
                <div className={styles.card__header}>
                  <span className={styles.close_icon}>
                    <AiFillCloseCircle size={50} onClick={(e) => setShowUserInfoModal(false)} />
                  </span>
                </div>

                <h2>Update your password</h2>

                <label htmlFor="username">Username (cannot be changed)</label>
                <input id="username" type="text" value={userInfo?.username} disabled />

                <label htmlFor="old_password">Enter old password</label>
                <input
                  id="old_password"
                  name="old_password"
                  type="password"
                  value={oldPassword}
                  minLength={AUTH_VALIDATION.password_min_length}
                  maxLength={AUTH_VALIDATION.password_max_length}
                  placeholder="Old password"
                  required
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                {/* Afficher message d'erreur de validation */}
                {oldPasswordValidationError?.empty === false && (
                  <p className={styles.error}>{oldPasswordValidationError?.error}</p>
                )}

                <label htmlFor="new_password">Enter new password</label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={newPassword}
                  minLength={AUTH_VALIDATION.password_min_length}
                  maxLength={AUTH_VALIDATION.password_max_length}
                  placeholder="New password"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                {/* Afficher message d'erreur de validation */}
                {newPasswordValidationError?.empty === false && (
                  <p className={styles.error}>{newPasswordValidationError?.error}</p>
                )}

                {/* Afficher un message d'erreur/confirmation la modification du mot de passe */}
                {passwordUpdatedStatus === "success" && (
                  <span className={styles.success}>{passwordUpdatedMessage}</span>
                )}
                {passwordUpdatedStatus === "error" && <span className={styles.error}>{passwordUpdatedMessage}</span>}

                <button>Update</button>
              </div>
            </form>
          </ModalContainer>
        </div>

        {/* Bouton supprimer tous les événements */}
        <h2>Deleting events</h2>
        <p>Deleting your events is irreversible.</p>
        <button
          className="button-delete"
          onClick={() => {
            const confirmation = confirm("Are you sure you want to delete all your events?");
            if (confirmation) {
              // Delete all events
              DeleteAllUserEvents();
            }
          }}>
          Delete all events
        </button>

        {/* Afficher un message d'erreur/confirmation du changement du premier jour du calendrier */}
        {calendarFirstDayStatus === "success" && <p className={styles.success}>{calendarFirstDayMessage}</p>}
        {calendarFirstDayStatus === "error" && <p className={styles.error}>{calendarFirstDayMessage}</p>}

        {/* Afficher un message d'erreur/confirmation la suppression des événements */}
        {deleteEventsStatus === "success" && <p className={styles.success}>{deleteEventsMessage}</p>}
        {deleteEventsStatus === "error" && <p className={styles.error}>{deleteEventsMessage}</p>}
      </div>
    </DashboardLayout>
  );
}
