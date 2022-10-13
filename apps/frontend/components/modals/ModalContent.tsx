import React from "react";

import styles from "./modal.module.sass";

/**
 * Content des modals
 */
const ModalContent = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_content}>{props.children}</div>;
};

export default ModalContent;
