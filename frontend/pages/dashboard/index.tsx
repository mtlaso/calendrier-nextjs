import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { API_URLS, SESSION_COOKIE_NAME } from "../../config/config";

import styles from "./dashboard.module.sass";

export default function Dashboard({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dt = new Date();

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
        <h2>Welcome back, {data.userData.username}.</h2>
        <p>You have x events in your calendar.</p>
        <p>Last sync : xx</p>

        <button className={styles.button}>Sync your calendar</button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Récupération le cookie de session
    const sessionCookie = context.req.cookies[SESSION_COOKIE_NAME];

    // Si la session n'existe pas, redirection vers la page de connexion
    if (sessionCookie === undefined) {
      const redirectMessage = encodeURIComponent("Please login to access dashboard");
      return {
        redirect: {
          permanent: false,
          destination: `/auth/login?message=${redirectMessage}`,
        },
      };
    }

    // Verifier que le cookie de session est valide en récupérant l'information sur l'utilisateur connecté
    const userReq = await fetch(API_URLS.users.getUserBySessionID, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        [SESSION_COOKIE_NAME]: sessionCookie,
      },
    });

    const userRes = await userReq.json();

    return {
      props: {
        data: { sessionCookie: sessionCookie, userData: userRes.data },
      },
    };
  } catch (err) {
    const redirectMessage = encodeURIComponent(`An error occured, ${err}`);
    return {
      redirect: {
        permanent: false,
        destination: `/auth/login?message=${redirectMessage}`,
      },
    };
  }
};
