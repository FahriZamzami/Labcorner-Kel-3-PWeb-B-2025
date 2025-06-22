-- AlterTable
ALTER TABLE `jadwal` ADD COLUMN `status` ENUM('Selesai', 'Belum_Mulai') NOT NULL DEFAULT 'Belum_Mulai';
