import React from "react";

import styles from "./header.module.scss";

const Header = (props: { clickBack: () => void; clickNext: () => void; showInfoModal: () => void }) => {
  return (
    <header className={styles.header}>
      <p id="header-date">loading...</p>
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
        {/* <Link className="link" to="/login">
          login
        </Link> */}
      </div>
    </header>
  );
};

export default Header;
