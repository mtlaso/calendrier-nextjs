[screen-recorder-sat-oct-15-2022-22-12-27.webm](https://user-images.githubusercontent.com/29934021/196014795-b031197a-5806-405f-b5bd-85a4c8179af9.webm)

[*en*](#Calendar)

# Calendrier - Synchronisation entre appareils en temps réel (avec websockets)

Calendrier créé avec Nextjs, avec possibilité de créer des évènements.

# Utilisation

1. Installer nodejs (version récente)
2. Cloner le projet
3. Lancez la commande `npm install` dans le dossier du projet
4. Frontend
   1. Lancer la commande `npm run dev:frontend` pour lancer le serveur de développement frontend.
5. Backend
   1. Installez postgresql, et créez une base de données.
   2. Remplissez le fichier `apps/calendar-api/.env.fake` avec les informations nécessaires.
   3. Renommez le fichier `.env.fake` en `.env`
   4. Ouvrir un autre terminal, puis lancer la commande `npm run dev:calendar-api` pour lancer le serveur de développement backend.

# Fonctionnalités

1. Calendrier

   - Naviguer sur les différents mois/années qui existent

2. Évènements
   - Créer un évènement sur le calendrier
   - Modifier un évènement sur le calendrier
   - Supprimer un évènement sur le calendrier
   - Synchronisation entre plusieurs sessions (appareils) connectées
   - Événements sauvegardés sur une base de données

# Technologies

Technologies utilisées : Html, Css, Javacscript, Typescript, Nodejs, Express.js, React, Nextjs, Recoil JS (state management), Websockets

---

# Calendar

Real-Time Synchronization Between Devices (with Websockets)
Calendar created with Next.js, with the ability to create events.

## Usage

1. Install Node.js (recent version)
2. Clone the project
3. Run the command `npm install` in the project folder
4. Frontend
   1. Run the command `npm run dev:frontend` to start the frontend development server.
5. Backend
   1. Install PostgreSQL and create a database.
   2. Fill in the `apps/calendar-api/.env.fake` file with the necessary information.
   3. Rename the file `.env.fake` to `.env`
   4. Open another terminal and run the command `npm run dev:calendar-api` to start the backend development server.

## Features

1. Calendar
   - Navigate through different months/years

2. Events
   - Create an event on the calendar
   - Edit an event on the calendar
   - Delete an event on the calendar
   - Synchronization between multiple connected sessions (devices)
   - Events saved in a database

## Technologies

Technologies used: HTML, CSS, JavaScript, TypeScript, Node.js, Express.js, React, Next.js, Recoil JS (state management), Websockets

