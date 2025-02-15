-- AddForeignKey
ALTER TABLE `warning_letters` ADD CONSTRAINT `warning_letters_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
