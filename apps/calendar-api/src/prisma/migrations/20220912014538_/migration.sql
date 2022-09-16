/*
  Warnings:

  - You are about to drop the column `event_creation_date_UTC` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_end_UTC` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_start_UTC` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_creation_date_UTC",
DROP COLUMN "event_end_UTC",
DROP COLUMN "event_start_UTC",
ADD COLUMN     "event_creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_end" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_start" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
