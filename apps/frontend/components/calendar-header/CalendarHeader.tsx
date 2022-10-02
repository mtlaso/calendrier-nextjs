import React from "react";
import Link from "next/link";

import styles from "./CalendarHeader.module.sass";

const CalendarHeader = (props: {
  headerText: string;
  clickBack: () => void;
  clickNext: () => void;
  showInfoModal: () => void;
  goToCurrentMonth: () => void;
}) => {
  return (
    <header className={styles.header}>
      <p id="header-date" style={{ cursor: "pointer" }} onClick={() => props.goToCurrentMonth()}>
        {props.headerText}
      </p>
      <div>
        {/* bouton back */}
        <button
          onClick={() => {
            props.clickBack();
          }}>
          back
        </button>

        {/* bouton next */}
        <button
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
        <Link className="link" href={"/auth/login"}>
          login
        </Link>
      </div>
    </header>
  );
};

export default CalendarHeader;
