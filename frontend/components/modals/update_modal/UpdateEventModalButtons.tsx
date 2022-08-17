import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal de modification d'un événement
 */
const UpdateEventModalButtons = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_buttons}>{props.children}</div>;
};

export default UpdateEventModalButtons;
