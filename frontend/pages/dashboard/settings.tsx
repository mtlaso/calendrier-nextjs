import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineUser, AiOutlineInfoCircle } from "react-icons/ai";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import DashboardHeader from "../../components/dashboard/DashboardLayout";
import { jwtState } from "../../state/jwt-state";
import { TypeUserInfo } from "../../types/TypeUserInfo";
import GenerateErrorMessage from "../../utils/generate-error-message";
import useUserInfo from "../../utils/useUserInfo";

import styles from "./dashboard.module.sass";

export default function Settings() {
  const router = useRouter();
  const [jwt, setJwt] = useRecoilState(jwtState);

  const [loading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<null | TypeUserInfo>(null);

  useEffect(() => {
    const LoadUserData = async () => {
      const [err, userInfo, isLoading] = await useUserInfo(jwt);

      if (err.length > 1) {
        // Rediriger vers la page de connexion
        setJwt("");
        router.push(`/auth/login?message=${err}`);
      } else {
        setUserInfo(userInfo);
        setIsLoading(isLoading);
      }
    };

    LoadUserData();
  }, []);

  if (loading) {
    return <span style={{ color: "white" }}>loading...</span>;
  }

  return (
    <DashboardHeader title="Settings">
      <div className={styles.content_container}>
        <h2>Settings</h2>

        <div className={styles.cards_container}>
          <div className={styles.card}>
            <div className={styles.card__header}>
              <h3>User info</h3>
              <span>
                <AiOutlineUser size={25} />
              </span>
            </div>

            <p>Username : {userInfo?.username}</p>
            <p>Password : *******</p>
          </div>

          <div className={styles.card}>
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
        </div>
      </div>
    </DashboardHeader>
  );
}
