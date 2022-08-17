import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal de modification d'un événement
 */
const UpdateEventModal = (props: { children: React.ReactNode; display: "block" | "none" }) => {
  return (
    <div
      className={styles.modal_container}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: props.display,
      }}>
      {props.children}
    </div>
  );
};

export default UpdateEventModal;
