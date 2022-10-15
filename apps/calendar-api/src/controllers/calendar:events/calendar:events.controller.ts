import ApiError from "../../types/ApiError";
import { TypeEvent } from "@calendar-nextjs/shared/types/TypeEvent";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Sauvegarde les événements de l'utilisateur dans la base de données
 * @param events Événements à sauvegarder
 * @param jwt jwt de l'utilisateur
 */
export async function SaveEventsToDb(events: TypeEvent[], jwt: any): Promise<void> {
  try {
    // TODO: Valider les événements

    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // Met à jour les événements de l'utilisateur
    for (const event of events) {
      await prisma.events.upsert({
        create: {
          user_id: userInfo.user_id,
          event_id: event.event_id,
          event_creation_date: event.event_creation_date,
          event_start: event.event_start,
          event_end: event.event_end,
          title: event.title,
          is_completed: event.is_completed,
          description: event.description,
          location: event?.location ?? undefined,
        },
        // Si l'événement existe déja, on le met à jour...
        update: {
          title: event.title,
          is_completed: event.is_completed,
          description: event.description,
          event_start: event.event_start,
          event_end: event.event_end,
        },
        // Si l'événement existe déja avec cet id, on le met à jour...
        where: {
          event_id: event.event_id,
        },
      });
    }
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Retourne les événements de l'utilisateur
 * @param jwt string
 */
export async function ReadEventsFromDb(jwt: any): Promise<TypeEvent[]> {
  try {
    // Récupère l'id de l'utilisateur (passé par le middleware IsLoggedIn)
    const userInfo = jwt;

    // Récupère les événements de l'utilisateur
    const events = await prisma.events.findMany({ where: { user_id: userInfo.user_id } });

    // Retourne les événements
    return events;
  } catch (err) {
    throw new ApiError((err as Error).message, 500);
  }
}

/**
 * Supprime un événement de la base de données
 */
export async function DeleteEventFromDb(event_id: string, jwt: any): Promise<void> {
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
