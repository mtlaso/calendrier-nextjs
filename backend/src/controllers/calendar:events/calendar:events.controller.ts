import ApiError from "../../types/ApiError";
import { TypeEvent } from "../../types/TypeEvent";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
    events.map(async (event) => {
      await prisma.events.upsert({
        where: {
          event_id: event.event_id,
        },
        create: {
          user_id: userInfo.user_id,
          event_id: event.event_id,
          event_creation_date: event.event_creation_date,
          event_date: event.event_date,
          title: event.title,
          is_completed: event.is_completed,
          description: event.description,
        },
        // Si l'événement existe déja, on le met à jour...
        update: {
          title: event.title,
          is_completed: event.is_completed,
          description: event.description,
        },
      });
    });
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
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // Récupère les événements de l'utilisateur
    const events = await prisma.events.findMany({ where: { user_id: userInfo.user_id } });

    return events;
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
    await prisma.events.deleteMany({
      where: {
        event_id: event_id,
        user_id: userInfo.user_id,
      },
    });
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
    await prisma.events.updateMany({
      where: { event_id: event_id, user_id: userInfo.user_id },
      data: { event_date: newDate },
    });
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}
