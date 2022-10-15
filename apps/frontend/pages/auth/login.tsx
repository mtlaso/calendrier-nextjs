import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import styles from "./auth.module.sass";

import { API_URLS } from "../../config/config";
import { AUTH_VALIDATION } from "@calendar-nextjs/shared/config/global-config";
import { jwtState } from "../../state/jwt-state";
import GenerateErrorMessage from "../../utils/generate-error-message";
import { TypeFormValidationError } from "../../types/TypeFormValidationError";

/**
 * Page de création de compte
 */
export default function Login() {
  const [jwtToken, setJwtToken] = useRecoilState(jwtState);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Query param passé depuis /dashboard en cas de redirection
  const [loginMessage, setLoginMessage] = useState("");

  const [usernameValidationError, setUsernameValidationError] = useState<TypeFormValidationError>();
  const [passwordValidationError, setPasswordValidationError] = useState<TypeFormValidationError>();

  // Récupérer les query string envoyé depuis le dashboard
  useEffect(() => {
    if (!router.isReady) return;

    let queryMessage = router.query.message; // query param &message
    if (!queryMessage) return;
    if (queryMessage instanceof Array) queryMessage = queryMessage[0];

    queryMessage = decodeURIComponent(queryMessage);

    setLoginMessage(queryMessage);
  }, [router.isReady]);

  // Si le token est déjà présent, redirection vers /dashboard
  useEffect(() => {
    if (jwtToken) router.push("/dashboard");
  }, []);

  // Validation du formulaire
  const ValidateForm = async () => {
    setLoginMessage("");

    // Vider les erreurs
    setUsernameValidationError({ empty: true });
    setPasswordValidationError({ empty: true });

    // Valider champs
    const username_l = username.trim().length;
    if (username_l < AUTH_VALIDATION.username_min_length || username_l > AUTH_VALIDATION.username_max_length) {
      setUsernameValidationError({
        empty: false,
        error: `Username must be between ${AUTH_VALIDATION.username_min_length} and ${AUTH_VALIDATION.username_max_length} characters.`,
      });
    }

    const password_l = password.trim().length;
    if (password_l < AUTH_VALIDATION.password_min_length || password_l > AUTH_VALIDATION.password_max_length) {
      setPasswordValidationError({
        empty: false,
        error: `Password must be between ${AUTH_VALIDATION.password_min_length} and ${AUTH_VALIDATION.password_max_length} characters.`,
      });
    }

    // Envoyer formulaire
    if (usernameValidationError?.empty === true && passwordValidationError?.empty === true) {
      SendForm();
    }
  };

  // Envoyer le formulaire
  const SendForm = async () => {
    try {
      const body = JSON.stringify({ username, password });
      const req = await fetch(API_URLS.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
        credentials: "include", // Doit être ici pour que les cookies soient sauvegardés
      });

      const res = await req.json();

      if (res.statusCode === 200) {
        // Redirection vers la page d'accueil
        setJwtToken(res.data.jwtToken);

        router.push("/dashboard");
      } else {
        const errMessage = GenerateErrorMessage("An error happend, try later.", res.message);
        setLoginMessage(errMessage);
      }
    } catch (error) {
      const errMessage = GenerateErrorMessage("An error happend, try later.", (error as Error).message);
      setLoginMessage(errMessage);
    }
  };

  return (
    <div className={styles.container_auth}>
      <div>
        <h1>Welcome back</h1>
        <h2>Enter your username and password to login.</h2>
        <p>Login to your account to be able to save and sync your events across all your devices.</p>
      </div>
      <div>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            ValidateForm();
          }}>
          <h2>Login</h2>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            minLength={AUTH_VALIDATION.username_min_length}
            maxLength={AUTH_VALIDATION.username_max_length}
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Afficher erreur de username */}
          {usernameValidationError?.empty === false && (
            <span className={styles.error}>{usernameValidationError.error}</span>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            minLength={AUTH_VALIDATION.password_min_length}
            maxLength={AUTH_VALIDATION.password_max_length}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Afficher erreur de password */}
          {passwordValidationError?.empty === false && (
            <span className={styles.error}>{passwordValidationError.error}</span>
          )}

          {/* Afficher un message d'erreur après la connexion du compte */}
          {loginMessage.length > 1 && <span className={styles.error}>{loginMessage.substring(0, 80) + "..."}</span>}

          <Link href="/auth/register" className="link">
            Register
          </Link>
          <Link href="/" className="link">
            Go to calendar
          </Link>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
