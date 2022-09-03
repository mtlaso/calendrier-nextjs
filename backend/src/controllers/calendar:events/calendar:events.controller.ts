import pool from "../../utils/postgres/postgres-pool";
import ApiError from "../../types/ApiError";
import { TypeEvent } from "../../types/TypeEvent";

/**
 * Sauvegarde les événements de l'utilisateur dans la base de données
 * @param events Événements à sauvegarder
 * @param jwt jwt de l'utilisateur
 */
export async function SaveEventsToDb(events: TypeEvent[], jwt: any) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // Met à jour les événements de l'utilisateur
    const client = await pool.connect();
    const query = `INSERT INTO events (user_id, event_id, event_creation_date, event_date, title, is_completed, description)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)
                  ON CONFLICT (event_id) DO UPDATE SET title = $5, is_completed = $6, description = $7
    `;
    for (const event of events) {
      await client.query(query, [
        userInfo.user_id,
        event.event_id,
        event.event_creation_date,
        event.event_date,
        event.title,
        event.is_completed,
        event.description,
      ]);
    }
    client.release();
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Retourne les événements de l'utilisateur
 * @param jwt string
 */
export async function ReadEventsFromDb(jwt: any) {
  try {
    // Récupère les événements de l'utilisateur
    const client = await pool.connect();
    const query = `SELECT user_id, event_id, event_creation_date, event_date, title, is_completed, description FROM events WHERE user_id = $1`;
    const r = await client.query(query, [jwt.user_id]);
    client.release();
    return r.rows as TypeEvent[];
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Supprime un événement de la base de données
 */
export async function DeleteEventFromDb(event_id: string, jwt: any) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // Supprime l'événement de la base de données
    const client = await pool.connect();
    const query = `DELETE FROM events WHERE event_id = $1 AND user_id = $2`;
    await client.query(query, [event_id, userInfo.user_id]);
    client.release();
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Changer la data d'un événement dans la base de données (drag and drop)
 */
export async function ChangeEventDateInDb(event_id: string, newDate: Date, jwt: any) {
  try {
    const userInfo = jwt;

    // Met à jour la date de l'événement
    const client = await pool.connect();
    const query = `UPDATE events SET event_date = $1 WHERE event_id = $2 AND user_id = $3`;
    await client.query(query, [newDate, event_id, userInfo.user_id]);
    client.release();
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}
