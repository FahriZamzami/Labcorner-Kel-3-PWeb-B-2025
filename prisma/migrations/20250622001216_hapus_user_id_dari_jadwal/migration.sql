/*
  Warnings:

  - You are about to drop the column `user_id` on the `jadwal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `jadwal` DROP FOREIGN KEY `jadwal_user_id_fkey`;

-- DropIndex
DROP INDEX `jadwal_user_id_fkey` ON `jadwal`;

-- AlterTable
ALTER TABLE `jadwal` DROP COLUMN `user_id`;
