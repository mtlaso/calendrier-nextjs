import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import { jwtState } from "../../state/jwt-state";
import { TypeUserInfo } from "../../types/TypeUserInfo";
import useUserEventsCount from "../../utils/api_requests/useUserEventsCount";
import useUserInfo from "../../utils/api_requests/useUserInfo";

import styles from "./dashboard.module.sass";

export default function Dashboard() {
  const router = useRouter();
  const [jwt, setJwt] = useRecoilState(jwtState);

  const [loading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<null | TypeUserInfo>(null);
  const [eventsCount, setEventsCount] = useState(0);

  // Charger les infos de l'utilisateur
  useEffect(() => {
    const LoadUserData = async () => {
      const [userInfoErr, userInfo] = await useUserInfo(jwt);
      const [userEventsErr, userEventsCount] = await useUserEventsCount(jwt);

      if (userInfoErr.length > 1) {
        // Supprimer le jwt de l'utilisateur
        setJwt("");

        // Rediriger vers la page de connexion
        router.push(`/auth/login?message=${userInfoErr}`);
        return;
      }

      if (userEventsErr.length > 1) {
        // Supprimer le jwt de l'utilisateur
        setJwt("");

        // Rediriger vers la page de connexion
        router.push(`/auth/login?message=${userEventsErr}`);
        return;
      }

      setUserInfo(userInfo);
      setEventsCount(userEventsCount);
      setIsLoading(false);
    };

    setIsLoading(true);
    LoadUserData();
  }, []);

  if (loading) {
    return <span style={{ color: "white" }}>loading...</span>;
  }

  return (
    <DashboardLayout>
      <div className={styles.content_container}>
        <h2>Welcome back, {userInfo?.username}.</h2>
        <p>You have {eventsCount} events in your calendar.</p>
      </div>
    </DashboardLayout>
  );
}
