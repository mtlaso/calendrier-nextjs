import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./auth.module.sass";

import { API_URLS, AUTH_VALIDATION } from "../../config/config";

/**
 * Page de création de compte
 */
export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginMessage, setLoginMessage] = useState("");

  const [usernameError, setUsernameError] = useState<TypeError>();
  const [passwordError, setPasswordError] = useState<TypeError>();

  // Récupérer les query string envoyé depuis le dashboard
  useEffect(() => {
    if (!router.isReady) return;

    let queryMessage = router.query.message;
    if (!queryMessage) return;
    if (queryMessage instanceof Array) queryMessage = queryMessage[0];

    queryMessage = decodeURIComponent(queryMessage);

    setLoginMessage(queryMessage);
  }, [router.isReady]);

  // Validation du formulaire
  const ValidateForm = async () => {
    setLoginMessage("");

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

    // Envoyer formulaire
    if (usernameError?.empty === true && passwordError?.empty === true) {
      SendForm();
    }
  };

  // Envoyer le formulaire
  const SendForm = async () => {
    try {
      const body = JSON.stringify({ username, password });
      const req = await fetch(API_URLS.login, {
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
        router.push("/dashboard");
      } else {
        setLoginMessage(res.message);
      }
    } catch (error) {
      // alert(`An error happend : ${error}`);
      setLoginMessage((error as Error).message);
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

          {/* Afficher un message d'erreur après la connexion du compte */}
          {loginMessage.length > 1 && <span className={styles.error}>{loginMessage}</span>}

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

/**
 * Type d'erreur
 */
type TypeError = {
  empty: boolean;
  error?: string;
};
