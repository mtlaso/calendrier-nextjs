import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const DATA_TO_RENDER: any[] = [];

export function CreateCalendarStructure(calendarStyles: any): any[] {
  // DATA_TO_RENDER.push(CreateSundayStructure(calendarStyles));
  // DATA_TO_RENDER.push(CreateMondayStructure(calendarStyles));

  return DATA_TO_RENDER;
}

/**
 * Créer la colonne "Sunday"
 */
export function CreateSundayStructure(calendarStyles: any) {
  const p = React.createElement("p", { key: "p-sun" }, "sun.");
  const hr = React.createElement("hr", { key: "hr-sun" }, null);

  const div = React.createElement("div", { className: calendarStyles.container_column, id: "container-column-sun" }, [
    p,
    hr,
  ]);

  return div;

  // Render elements
  // const container = document.getElementById("container");
  // const root = createRoot(container!);
  // root.render(div);
  // ReactDOM.render([div], document.getElementById("container"));
  // DATA_TO_RENDER.push(div);
}

/**
 * Créer la colonne "Monday"
 */
export function CreateMondayStructure(calendarStyles: any) {
  const p = React.createElement("p", null, "mon.");
  const hr = React.createElement("hr", null, null);

  const div = React.createElement("div", { className: calendarStyles.container_column, id: "container-column-mon" }, [
    p,
    hr,
  ]);

  return div;

  // Render elements
  // ReactDOM.render(div, document.getElementById("container"));
  // DATA_TO_RENDER.push(div);
}

/**
 * Créer la colonne "Tuesday"
 */
export function CreateTuesdayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-tue";
  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("tue."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
}

/**
 * Créer la colonne "Wednesday"
 */
export function CreateWednesayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-wed";

  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("wed."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
}

/**
 * Créer la colonne "Thursday"
 */
export function CreateThursdayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-thu";

  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("thu."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
}

/**
 * Créer la colonne "Friday"
 */
export function CreateFridayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-fri";
  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("fri."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
}

/**
 * Créer la colonne "Saturday"
 */
export function CreateSaturdayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-sat";
  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("sat."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
}
