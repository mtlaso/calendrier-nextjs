/**
 * Créer la colonne "Sunday"
 */
export function CreateSundayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-sun";
  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("sun."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);
  document.getElementById("container")?.appendChild(div);
}

/**
 * Créer la colonne "Monday"
 */
export function CreateMondayStructure() {
  const div = document.createElement("div");
  div.id = "container-column-mon";
  div.classList.add("container-column");

  const p = document.createElement("p");
  p.appendChild(document.createTextNode("mon."));

  const hr = document.createElement("hr");

  div.appendChild(p);
  div.appendChild(hr);

  document.getElementById("container")?.appendChild(div);
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
