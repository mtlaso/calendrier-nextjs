import pool from "../../utils/postgres/postgres-pool";
import ApiError from "../../types/ApiError";
import { TypeEvent } from "../../types/TypeEvent";

/**
 * Sauvegarde les événements de l'utilisateur dans la base de données
 * @param events Événements à sauvegarder
 * @param jwt jwt de l'utilisateur
 */
export async function SaveEventsToDb(events: TypeEvent[], jwt: string) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // TODO : Valider événements

    // Met à jour les événements de l'utilisateur
    const client = await pool.connect();
    // event_creation_date = $3, event_date = $4,
    const query = `INSERT INTO events (user_id, event_id, event_creation_date, event_date, title, is_completed)
                  VALUES ($1, $2, $3, $4, $5, $6)
                  ON CONFLICT (event_id) DO UPDATE SET title = $5, is_completed = $6
    `;
    for (const event of events) {
      const r = await client.query(query, [
        // @ts-expect-error
        userInfo.user_id,
        event.event_id,
        event.event_creation_date,
        event.event_date,
        event.title,
        event.is_completed,
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
export async function ReadEventsFromDb(jwt: string) {
  try {
    // Récupère les événements de l'utilisateur
    const client = await pool.connect();
    const query = `SELECT user_id, event_id, event_creation_date, event_date, title, is_completed FROM events WHERE user_id = $1`;
    const r = await client.query(
      query,
      // @ts-expect-error
      [jwt.user_id]
    );
    client.release();
    return r.rows as TypeEvent[];
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Supprime un événement de la base de données
 */
export async function DeleteEventFromDb(event_id: string, jwt: string) {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // TODO : valider event_id

    // Supprime l'événement de la base de données
    const client = await pool.connect();
    const query = `DELETE FROM events WHERE event_id = $1 AND user_id = $2`;
    const r = await client.query(query, [
      event_id,
      // @ts-expect-error
      userInfo.user_id,
    ]);
    client.release();
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}
