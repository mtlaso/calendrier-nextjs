import React from "react";
import { AiOutlineCloud, AiOutlineCloudSync } from "react-icons/ai";
import Link from "next/link";

import styles from "./CalendarFooter.module.sass";
import { TypeCalendarSyncStatus } from "../../types/TypeCalendarSyncStatus";

function CalendarFooter({ syncStatus }: { syncStatus: TypeCalendarSyncStatus }) {
  return (
    <footer className={styles.container}>
      {/* Sync status */}
      <div>
        {syncStatus === "synced" && (
          <p className={`${styles.text} ${styles.synced}`}>
            <span>
              <AiOutlineCloud size={25} />
            </span>
            Calendar synced
          </p>
        )}

        {syncStatus === "syncing" && (
          <p className={`${styles.text} ${styles.syncing}`}>
            <span>
              <AiOutlineCloud size={25} />
            </span>
            Calendar syncing...
          </p>
        )}

        {syncStatus === "notsynced" && (
          <p className={`${styles.text} ${styles.not_synced}`}>
            <span>
              <AiOutlineCloud size={25} />
            </span>
            Calendar not synced
          </p>
        )}
      </div>

      <div>
        {syncStatus === "synced" && (
          <Link href={"/dashboard"} className={styles.text}>
            Access your dashboard
          </Link>
        )}

        {syncStatus === "notsynced" && (
          <Link href={"/auth/login"} className={styles.text}>
            Login to sync your calendar
          </Link>
        )}
      </div>
    </footer>
  );
}

export default CalendarFooter;
