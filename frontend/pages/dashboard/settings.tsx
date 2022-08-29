import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineInfoCircle, AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState } from "recoil";

import DashboardHeader from "../../components/dashboard/DashboardLayout";
import UpdateSettingsModal from "../../components/modals/update_settings_modal/UpdateSettingsModal";

import { API_URLS, AUTH_VALIDATION } from "../../config/config";
import { jwtState } from "../../state/jwt-state";
import useUserInfo from "../../utils/api_requests/useUserInfo";
import GenerateErrorMessage from "../../utils/generate-error-message";

import { TypeUserInfo } from "../../types/TypeUserInfo";
import { TypeFormError } from "../../types/TypeFormValidationError";

import styles from "./dashboard.module.sass";

export default function Settings() {
  const router = useRouter();
  const [jwt, setJwt] = useRecoilState(jwtState);

  const [loading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<null | TypeUserInfo>(null);

  const [showUserInfoModal, setShowUserInfoModal] = useState<"block" | "none">("none");

  const [password, setPassword] = useState<string>("");
  const [passwordValidationError, setPasswordValidationError] = useState<TypeFormError>();

  // Champs utilisés pour afficher le status et le message de confirmation/erreur lors de la modification du mot de passe
  const [passwordUpdatedStatus, setPasswordUpdatedStatus] = useState<"success" | "error" | null>(null);
  const [passwordUpdatedMessage, setPasswordUpdatedMessage] = useState<string>("");

  // Charger les informations sur l'utilisateur
  useEffect(() => {
    const LoadUserData = async () => {
      const [err, userInfo, isLoading] = await useUserInfo(jwt);

      if (err.length > 1) {
        // Supprimer le jwt de l'utilisateur
        setJwt("");

        // Rediriger vers la page de connexion
        router.push(`/auth/login?message=${err}`);
      } else {
        setUserInfo(userInfo);
        setIsLoading(isLoading);
      }
    };

    LoadUserData();
  }, []);

  // Valider le formulaire de modification du mot de passe
  const ValidatePasswordForm = async () => {
    // Vider les erreurs
    setPasswordValidationError({ empty: true });
    setPasswordUpdatedStatus(null);
    setPasswordUpdatedMessage("");

    if (
      password.length < AUTH_VALIDATION.password_min_length ||
      password.length > AUTH_VALIDATION.password_max_length
    ) {
      setPasswordValidationError({
        empty: false,
        error: `Password must be between ${AUTH_VALIDATION.password_min_length} and ${AUTH_VALIDATION.password_max_length} characters.`,
      });
    }

    if (passwordValidationError?.empty) {
      // Enovyer la requete de modification du mot de passe
      SendUpdatePasswordForm();
    }
  };

  // Envoyer le formulaire
  const SendUpdatePasswordForm = async () => {
    try {
      const body = JSON.stringify({ password });

      const req = await fetch(API_URLS.users.updateUserPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${jwt}`,
        },
        body: body,
      });

      const res = await req.json();

      if (res.statusCode === 200) {
        setPasswordUpdatedStatus("success");
        setPasswordUpdatedMessage("Password updated successfully.");
      } else {
        setPasswordUpdatedStatus("error");
        const errMessage = GenerateErrorMessage("An error occured while updating your password.", res.message);
        setPasswordUpdatedMessage(errMessage);
      }
    } catch (error) {
      setPasswordUpdatedStatus("error");
      const errMessage = GenerateErrorMessage("An error occured while creating your account", (error as Error).message);
      setPasswordUpdatedMessage(errMessage);
    }
  };

  if (loading) {
    return <span style={{ color: "white" }}>loading...</span>;
  }

  return (
    <DashboardHeader title="Settings">
      <div className={styles.content_container}>
        <h2>Settings</h2>

        <div className={styles.cards_container}>
          {/* User info */}
          <div
            className={styles.card}
            onClick={(e) => setShowUserInfoModal(showUserInfoModal === "block" ? "none" : "block")}>
            <div className={styles.card__header}>
              <h3>User info</h3>
              <span>
                <AiOutlineUser size={25} />
              </span>
            </div>

            <p>Username : {userInfo?.username}</p>
            <p>Password : *******</p>
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
          <UpdateSettingsModal display={showUserInfoModal}>
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
                    <AiFillCloseCircle size={50} onClick={(e) => setShowUserInfoModal("none")} />
                  </span>
                </div>

                <h2>Update your details</h2>

                <label htmlFor="username">Username (cannot be changed)</label>
                <input id="username" type="text" value={userInfo?.username} disabled />

                <label htmlFor="password">Enter new password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  minLength={AUTH_VALIDATION.password_min_length}
                  maxLength={AUTH_VALIDATION.password_max_length}
                  placeholder="********"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                {passwordValidationError?.empty === false && (
                  <p className={styles.error}>{passwordValidationError?.error}</p>
                )}

                {/* Afficher un message d'erreur/confirmation la modification du mot de passe */}
                {passwordUpdatedStatus === "success" && (
                  <span className={styles.success}>{passwordUpdatedMessage}</span>
                )}
                {passwordUpdatedStatus === "error" && <span className={styles.error}>{passwordUpdatedMessage}</span>}

                <button>Update</button>
              </div>
            </form>
          </UpdateSettingsModal>
        </div>
      </div>
    </DashboardHeader>
  );
}
