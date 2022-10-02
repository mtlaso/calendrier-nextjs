import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal d'ajout d'évènement
 */
const AddEventModal = (props: { children: React.ReactNode; display: boolean }) => {
  if (!props.display) return null;
  return (
    <div
      className={styles.modal_container}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "block",
      }}>
      {props.children}
    </div>
  );
};

export default AddEventModal;
