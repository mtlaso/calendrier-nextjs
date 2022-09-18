# TODO:

1. Événements sur plusieurs jours
1. Ajouter champs : `event_start_date`, `event_date_end`, `event_time_start`, `event_time_end`, `event_location`, `all_day_event`
1. Modifier les TypeEvent pour prendre en compte ces champs
1. Validation des événements (calendar:events.controller.ts)
1. Quand on supprime un utilisateur, supprimer ces événements (onDelete: 'CASCADE', onUpdate: 'CASCADE')
1. Corriger info modal
1. bouton pour retourner à aujourd'hui
1. Changer le title de la page avec le mois
