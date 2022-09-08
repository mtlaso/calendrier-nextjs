import React from "react";
import { AiOutlineCloud, AiOutlineCloudSync } from "react-icons/ai";
import { IoCloudOfflineOutline } from "react-icons/io5";

import Link from "next/link";

import styles from "./CalendarFooter.module.sass";
import { TypeCalendarSyncStatus } from "../../types/TypeCalendarSyncStatus";

/**
 * Barre de status du calendrier
 */
function CalendarFooter({
  syncStatus,
}: {
  /**
   * Statut de synchronisation du calendrier
   */
  syncStatus: TypeCalendarSyncStatus;
}): JSX.Element {
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
              <AiOutlineCloudSync size={25} />
            </span>
            Calendar syncing...
          </p>
        )}

        {/* Message */}
        {syncStatus === "notsynced" && (
          <p className={`${styles.text} ${styles.not_synced}`}>
            <span>
              <IoCloudOfflineOutline size={20} />
            </span>
            Cannot sync
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
