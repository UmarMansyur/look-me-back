/*
  Warnings:

  - The values [Accepted] on the enum `permission_requests_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `permission_requests` MODIFY `status` ENUM('Pending', 'Approved', 'Revised', 'Rejected') NOT NULL DEFAULT 'Pending';
