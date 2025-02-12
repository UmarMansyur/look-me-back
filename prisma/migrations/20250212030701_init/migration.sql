/*
  Warnings:

  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institution_id` to the `holidays` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_user_id_fkey`;

-- AlterTable
ALTER TABLE `holidays` ADD COLUMN `institution_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `events`;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
