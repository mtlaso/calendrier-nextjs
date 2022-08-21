import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSWR from "swr";

import { API_URLS, SESSION_COOKIE_NAME } from "../../config/config";
import { jwtState } from "../../state/jwt-state";

import styles from "./dashboard.module.sass";

export default function Dashboard() {
  const router = useRouter();
  const [jwtToken, setJwtToken] = useRecoilState(jwtState);

  const [loading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<null | { data?: any }>(null);

  // Charger les informations sur l'utilisateur
  useEffect(() => {
    // Si pas de jwtToken, redirection vers la page de connexion
    if (!jwtToken) {
      const errMessage = GenerateErrorMessage("You need to be logged in to access this page");
      router.push(`/auth/login?message=${errMessage}`);
    }

    // Sinon, charger les informations de l'utilisateur
    const fetchUserData = async () => {
      try {
        // Récupérer les informations de l'utilisateur
        const userReq = await fetch(API_URLS.users.getUser, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwtToken}`,
          },
        });

        // Sinon, charger les informations de l'utilisateur
        const userRes = await userReq.json();

        // Définir les informations de l'utilisateur
        setUserData(userRes);

        // Termine le chargement
        setIsLoading(false);
      } catch (err) {
        // Supprimer le jwt token, car il est peut-être invalide
        const errMessage = GenerateErrorMessage("An error happend, try again later", `${err}`);
        router.push(`/auth/login?message=${errMessage}`);
      }
    };

    fetchUserData();
  }, [jwtToken]);

  if (loading) {
    return <span>loading...</span>;
  }

  if (!userData?.data) {
    // Supprimer le jwt token, car il est peut-être invalide
    setJwtToken("");
    const errMessage = GenerateErrorMessage("An error occured while fetching user data");
    router.push(`/auth/login?message=${errMessage}`);
  }

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href={"/dashboard"}>
              <a className={router.pathname === "/dashboard" ? styles.link_active : ""}>Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href={"/dashboard/settings"}>
              <a className={router.pathname === "/dashboard/settings" ? styles.link_active : ""}>Settings</a>
            </Link>
          </li>
          <li>
            <Link href={"/"}>Calendar</Link>
          </li>
        </ul>
      </nav>
      <hr />

      <div className={styles.content_container}>
        <h2>Welcome back, {userData?.data?.username}.</h2>
        <p>You have x events in your calendar.</p>
        <p>Last sync : xx</p>
        <button className={styles.button}>Sync your calendar</button>
      </div>
    </div>
  );
}

/**
 * Génére un message d'erreur. Affiche le "reasonMessage" seulement si NODE_ENV est en "development"
 * @param genericErrorMessage Message générique d'erreur
 * @param reasonMessage Raison de l'erreur
 * @returns Le message d'erreur
 */
const GenerateErrorMessage = (genericErrorMessage: string, reasonMessage?: string) => {
  if (process.env.NODE_ENV === "development") {
    return `${genericErrorMessage}${reasonMessage ? ` : ${reasonMessage}` : ""}`;
  } else {
    return genericErrorMessage;
  }
};
