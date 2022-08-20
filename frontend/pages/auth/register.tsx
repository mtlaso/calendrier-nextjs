import { useState } from "react";
import Link from "next/link";

import styles from "./auth.module.sass";

import { API_URLS, AUTH_VALIDATION } from "../../config/config";

/**
 * Page de création de compte
 */
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [accountCreated, setAccountCreated] = useState<"success" | "error" | null>(null);
  const [accountCreatedMessage, setAccountCreatedMessage] = useState("");

  const [usernameError, setUsernameError] = useState<TypeError>();
  const [passwordError, setPasswordError] = useState<TypeError>();

  // Validation du formulaire
  const ValidateForm = async () => {
    setAccountCreated(null);
    setAccountCreatedMessage("");

    // Vider les erreurs
    setUsernameError({ empty: true });
    setPasswordError({ empty: true });

    // Valider champs
    const username_l = username.trim().length;
    if (username_l < AUTH_VALIDATION.username_min_length || username_l > AUTH_VALIDATION.username_max_length) {
      setUsernameError({
        empty: false,
        error: `Username must be between ${AUTH_VALIDATION.username_min_length} and ${AUTH_VALIDATION.username_max_length} characters.`,
      });
    }

    const password_l = password.trim().length;
    if (password_l < AUTH_VALIDATION.password_min_length || password_l > AUTH_VALIDATION.password_max_length) {
      setPasswordError({
        empty: false,
        error: `Password must be between ${AUTH_VALIDATION.password_min_length} and ${AUTH_VALIDATION.password_max_length} characters.`,
      });
    }

    // Envoyer formulaire si il y a aucune erreur
    if (usernameError?.empty === true && passwordError?.empty === true) {
      SendForm();
    }
  };

  // Envoyer le formulaire
  const SendForm = async () => {
    try {
      const body = JSON.stringify({ username, password });
      const req = await fetch(API_URLS.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const res = await req.json();

      if (res.statusCode === 200) {
        setAccountCreated("success");
      } else {
        setAccountCreated("error");
        setAccountCreatedMessage(res.message);
      }
    } catch (error) {
      // alert(`An error happend : ${error}`);
      setAccountCreated("error");
      setAccountCreatedMessage((error as Error).message);
    }
  };

  return (
    <div className={styles.container_auth}>
      <div>
        <h1 className={styles.text_title}>Calendar</h1>
        <h2>Signup to access more features.</h2>
        <p>Create an account to be able to save and sync your events across all your devices.</p>
      </div>
      <div>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            ValidateForm();
          }}>
          <h2>Register</h2>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            minLength={AUTH_VALIDATION.username_min_length}
            maxLength={AUTH_VALIDATION.username_max_length}
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Afficher erreur de username */}
          {usernameError?.empty === false && <span className={styles.error}>{usernameError.error}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={AUTH_VALIDATION.password_min_length}
            maxLength={AUTH_VALIDATION.password_max_length}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Afficher erreur de password */}
          {passwordError?.empty === false && <span className={styles.error}>{passwordError.error}</span>}

          {/* Afficher un message après la création du compte */}
          {accountCreated === "success" ? (
            <span className={styles.success}>New account created.</span>
          ) : accountCreated === "error" ? (
            <span className={styles.error}>An error happend, try later. {accountCreatedMessage}</span>
          ) : null}

          <Link href="/auth/login" className="link">
            Already have an account?
          </Link>
          <Link href="/" className="link">
            Go to calendar
          </Link>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

/**
 * Type d'erreur
 */
type TypeError = {
  empty: boolean;
  error?: string;
};
