import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal d'ajout d'évènement
 */
const AddEventModalContent = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_content}>{props.children}</div>;
};

export default AddEventModalContent;
