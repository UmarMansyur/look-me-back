/*
  Warnings:

  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendances` DROP FOREIGN KEY `attendances_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `black_lists` DROP FOREIGN KEY `black_lists_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `operating_hours` DROP FOREIGN KEY `operating_hours_institution_id_fkey`;

-- DropForeignKey
ALTER TABLE `permission_requests` DROP FOREIGN KEY `permission_requests_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_institutions` DROP FOREIGN KEY `user_institutions_institution_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_institutions` DROP FOREIGN KEY `user_institutions_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `warning_letters` DROP FOREIGN KEY `warning_letters_user_id_fkey`;

-- DropIndex
DROP INDEX `attendances_user_id_fkey` ON `attendances`;

-- DropIndex
DROP INDEX `black_lists_user_id_fkey` ON `black_lists`;

-- DropIndex
DROP INDEX `events_user_id_fkey` ON `events`;

-- DropIndex
DROP INDEX `notifications_user_id_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `operating_hours_institution_id_fkey` ON `operating_hours`;

-- DropIndex
DROP INDEX `permission_requests_user_id_fkey` ON `permission_requests`;

-- DropIndex
DROP INDEX `user_institutions_institution_id_fkey` ON `user_institutions`;

-- DropIndex
DROP INDEX `user_institutions_user_id_fkey` ON `user_institutions`;

-- DropIndex
DROP INDEX `user_roles_role_id_fkey` ON `user_roles`;

-- DropIndex
DROP INDEX `user_roles_user_id_fkey` ON `user_roles`;

-- DropIndex
DROP INDEX `warning_letters_user_id_fkey` ON `warning_letters`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `bio`,
    ADD COLUMN `date_of_birth` DATE NOT NULL;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warning_letters` ADD CONSTRAINT `warning_letters_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_institutions` ADD CONSTRAINT `user_institutions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_institutions` ADD CONSTRAINT `user_institutions_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operating_hours` ADD CONSTRAINT `operating_hours_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `black_lists` ADD CONSTRAINT `black_lists_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permission_requests` ADD CONSTRAINT `permission_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
