-- DropForeignKey
ALTER TABLE `jawabankuis` DROP FOREIGN KEY `jawabanKuis_kuis_id_fkey`;

-- DropForeignKey
ALTER TABLE `pertanyaan` DROP FOREIGN KEY `pertanyaan_kuis_id_fkey`;

-- DropIndex
DROP INDEX `jawabanKuis_kuis_id_fkey` ON `jawabankuis`;

-- DropIndex
DROP INDEX `pertanyaan_kuis_id_fkey` ON `pertanyaan`;

-- AddForeignKey
ALTER TABLE `pertanyaan` ADD CONSTRAINT `pertanyaan_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawabanKuis` ADD CONSTRAINT `jawabanKuis_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
