/*
  Warnings:

  - You are about to drop the column `event_end_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_end_time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_location` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_start_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_start_time` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "event_end_date",
DROP COLUMN "event_end_time",
DROP COLUMN "event_location",
DROP COLUMN "event_start_date",
DROP COLUMN "event_start_time";
