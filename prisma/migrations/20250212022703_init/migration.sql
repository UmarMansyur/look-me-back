/*
  Warnings:

  - Added the required column `late_tolerance` to the `operating_hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `operating_hours` ADD COLUMN `late_tolerance` INTEGER NOT NULL;
