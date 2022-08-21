import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./DashboardLayout.module.sass";

export default function DashboardLayout(props: { title?: string; children: React.ReactNode }) {
  const router = useRouter();
  const { title, children } = props;

  return (
    <div className={styles.container}>
      <h1>{title ?? "Dashboard"}</h1>
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

      {children}
    </div>
  );
}
