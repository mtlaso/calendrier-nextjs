import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal de modification d'un événement
 */
const UpdateEventModalContent = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_content}>{props.children}</div>;
};

export default UpdateEventModalContent;
