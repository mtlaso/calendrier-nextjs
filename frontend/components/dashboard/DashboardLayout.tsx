import React, { useEffect } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress"; //nprogress module

import styles from "./DashboardLayout.module.sass";

export default function DashboardLayout(props: { title?: string; children: React.ReactNode }) {
  const router = useRouter();
  const { title, children } = props;

  // Initialiser de la barre de progression (nprogress)
  NProgress.configure({ showSpinner: false });
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());
  // Fin de la barre de progression (nprogress)

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
