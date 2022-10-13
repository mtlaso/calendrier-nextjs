import React from "react";
import Link from "next/link";

import { TypeCalendarSyncStatus } from "../../types/TypeCalendarSyncStatus";

import styles from "./CalendarHeader.module.sass";

const CalendarHeader = (props: {
  /**
   * Le texte contentant le mois et l'année actuels
   */
  headerText: string;
  /**
   * Aller au mois précédent
   */
  clickBack: () => void;
  /**
   * Aller au prochain mois
   */
  clickNext: () => void;
  /**
   * Afficher la modale d'informations
   */
  showInfoModal: () => void;
  /**
   * Bouton pour aller à la date du jour
   */
  goToCurrentMonth: () => void;
  /**
   * Statut de synchronisation du calendrier
   */
  syncStatus: TypeCalendarSyncStatus;
}) => {
  return (
    <header className={styles.header}>
      <p id="header-date" style={{ cursor: "pointer" }} onClick={() => props.goToCurrentMonth()}>
        {props.headerText}
      </p>
      <div>
        {/* bouton back */}
        <button
          disabled={props.syncStatus !== "synced"}
          style={{ cursor: props.syncStatus !== "synced" ? "not-allowed" : "pointer" }}
          onClick={() => {
            props.clickBack();
          }}>
          back
        </button>

        {/* bouton next */}
        <button
          disabled={props.syncStatus !== "synced"}
          style={{ cursor: props.syncStatus !== "synced" ? "not-allowed" : "pointer" }}
          onClick={() => {
            props.clickNext();
          }}>
          next
        </button>

        {/* bouton info */}
        <button
          className={styles.info_icon}
          onClick={() => {
            props.showInfoModal();
          }}>
          Info
        </button>

        {/* lien login */}
        {props.syncStatus !== "synced" && (
          <Link className="link" href={"/auth/login"}>
            login
          </Link>
        )}
      </div>
    </header>
  );
};

export default CalendarHeader;
