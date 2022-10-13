import React from "react";

import styles from "./modal.module.sass";

/**
 * Container des boutons des modals
 */
const ModalButtons = (props: { children: React.ReactNode }) => {
  return <div className={styles.modal_buttons}>{props.children}</div>;
};

export default ModalButtons;
