import React from "react";

import ModalButtons from "../ModalButtons";
import ModalContainer from "../ModalContainer";
import ModalContent from "../ModalContent";

/**
 * Modal qui affiche un guide
 */
const InfoModal = (props: { display: boolean; CloseModal: () => void }) => {
  if (!props.display) return null;

  return (
    <ModalContainer display={props.display}>
      <ModalContent>
        <h1>Guide</h1>

        <h2>1. Navigation</h2>
        <ul style={{ listStyle: "none" }}>
          <li>
            <p>
              Press <code className="button">next</code> button to go to the next month.
            </p>
          </li>
          <li>
            <p>
              Press <code className="button">back</code> button to go to the previous month.
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
              To <code>delete</code> an event, click on any given event (in blue) and click the{" "}
              <code className="delete">delete</code> button.
            </p>
          </li>
        </ul>

        <h2>3. Guide</h2>
        <p>
          To show this guide, press the <code className="button">info</code> button on top of the page.
        </p>

        <h2>4. Source code</h2>
        <p>
          Find the source code on{" "}
          <a href="https://github.com/euuuuh/calendrier-nextjs" rel="noreferrer" target={"_blank"}>
            GitHub
          </a>
          .
        </p>
      </ModalContent>

      <hr />

      <ModalButtons>
        <button
          className="button-cancel"
          onClick={() => {
            props.CloseModal();
          }}>
          Close
        </button>
      </ModalButtons>
    </ModalContainer>
  );
};

export default InfoModal;
