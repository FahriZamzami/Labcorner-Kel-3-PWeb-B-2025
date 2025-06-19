-- AlterTable
ALTER TABLE `tugas` ADD COLUMN `status` ENUM('open', 'close') NOT NULL DEFAULT 'open';
