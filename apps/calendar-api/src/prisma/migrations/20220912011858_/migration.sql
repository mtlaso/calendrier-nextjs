/*
  Warnings:

  - You are about to drop the column `event_creation_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_end` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_start` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_creation_date",
DROP COLUMN "event_end",
DROP COLUMN "event_start",
ADD COLUMN     "event_creation_date_UTC" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_end_UTC" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_start_UTC" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
