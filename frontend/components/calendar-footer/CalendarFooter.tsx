import React from "react";
import { AiOutlineCloud, AiOutlineCloudSync } from "react-icons/ai";
import Link from "next/link";

import styles from "./CalendarFooter.module.sass";

// Status du calendrier (synchronisé, en cours de synchronisation, non connecté)
// Derniere synchronisation
// Bouton de synchronisation

function CalendarFooter({ syncStatus }: { syncStatus: boolean }) {
  return (
    <footer className={styles.container}>
      {/* Sync status */}
      <div>
        {syncStatus && (
          <p className={`${styles.text} ${styles.synced}`}>
            <span>
              <AiOutlineCloud size={25} />
            </span>
            Calendar synced
          </p>
        )}

        {!syncStatus && (
          <p className={`${styles.text} ${styles.not_synced}`}>
            <span>
              <AiOutlineCloud size={25} />
            </span>
            Calendar not synced
          </p>
        )}
      </div>

      {syncStatus && (
        <Link href={"/dashboard"} className={styles.text}>
          Access your dashboard
        </Link>
      )}

      {!syncStatus && (
        <Link href={"/auth/login"} className={styles.text}>
          Login to sync your calendar
        </Link>
      )}
    </footer>
  );
}

export default CalendarFooter;
