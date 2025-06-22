-- AlterTable
ALTER TABLE `jadwal` ADD COLUMN `materi` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tugas` ALTER COLUMN `status` DROP DEFAULT;
