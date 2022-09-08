import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal d'ajout d'évènement
 */
const AddEventModalButtons = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_buttons}>{props.children}</div>;
};

export default AddEventModalButtons;
