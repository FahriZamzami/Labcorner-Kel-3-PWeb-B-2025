-- AlterTable
ALTER TABLE `tugas` MODIFY `status` ENUM('open', 'close') NOT NULL DEFAULT 'open';
