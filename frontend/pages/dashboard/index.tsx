import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import DashboardHeader from "../../components/dashboard/DashboardLayout";

import { API_URLS } from "../../config/config";
import { jwtState } from "../../state/jwt-state";
import { TypeUserInfo } from "../../types/TypeUserInfo";
import GenerateErrorMessage from "../../utils/generate-error-message";
import useUserInfo from "../../utils/useUserInfo";

import styles from "./dashboard.module.sass";

export default function Dashboard() {
  const router = useRouter();
  const [jwt, setJwt] = useRecoilState(jwtState);

  const [loading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<null | TypeUserInfo>(null);

  useEffect(() => {
    const LoadUserData = async () => {
      const [err, userInfo, isLoading] = await useUserInfo(jwt);

      if (err.length > 1) {
        // Rediriger vers la page de connexion
        router.push(`/auth/login?message=${err}`);
      } else {
        setUserInfo(userInfo);
        setIsLoading(isLoading);
      }
    };

    LoadUserData();
  }, []);

  return (
    <DashboardHeader>
      <div className={styles.content_container}>
        <h2>Welcome back, {userInfo?.username}.</h2>
        <p>You have x events in your calendar.</p>
        <p>Last sync : xx</p>
        <button className={styles.button}>Sync your calendar</button>
      </div>
    </DashboardHeader>
  );
}
