import React from "react";

import styles from "../modal.module.sass";

/**
 * Modal qui affiche un guide
 */
const GuideModal = (props: { display: "flex" | "none"; CloseModal: () => void }) => {
  return (
    <div
      className={styles.modal_container}
      style={{
        height: "100vh",
        display: props.display,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div className={styles.modal_content}>
        <h1>Guide</h1>

        <h2>1. Navigation</h2>
        <ul style={{ listStyle: "none" }}>
          <li>
            <p>
              Press <code>next</code> button to go to the next month.
            </p>
          </li>
          <li>
            <p>
              Press <code>back</code> button to go to the previous month.
            </p>
          </li>
        </ul>

        <h2>2. Events</h2>
        <ul style={{ listStyle: "none" }}>
          <li>
            <p>
              To <code>add</code> an event, double click on any given day.
            </p>
          </li>
          <li>
            <p>
              To <code>update</code> an event, click on any given event (in blue).
            </p>
          </li>
          <li>
            <p>
              To <code>delete</code> an event, click on any given event (in blue) and click the <code>delete</code>{" "}
              button.
            </p>
          </li>
        </ul>

        <h2>3. Guide</h2>
        <p>
          To show this guide, press the <code>info</code> button on top of the page.
        </p>

        <h2>4. Source code</h2>
        <p>
          Find the source code on{" "}
          <a href="https://github.com/euuuuh/calendrier-nextjs" rel="noreferrer" target={"_blank"}>
            GitHub
          </a>
          .
        </p>
      </div>
      <hr />
      <div className={styles.modal_buttons}>
        <button
          className="button-cancel"
          onClick={() => {
            props.CloseModal();
          }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default GuideModal;
