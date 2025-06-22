-- DropForeignKey
ALTER TABLE `absensi` DROP FOREIGN KEY `absensi_jadwal_id_fkey`;

-- DropForeignKey
ALTER TABLE `jadwal` DROP FOREIGN KEY `jadwal_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `kuis` DROP FOREIGN KEY `kuis_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `mahasiswa_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `modul` DROP FOREIGN KEY `modul_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `pengumpulan` DROP FOREIGN KEY `pengumpulan_tugas_id_fkey`;

-- DropForeignKey
ALTER TABLE `pengumuman` DROP FOREIGN KEY `pengumuman_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `tugas` DROP FOREIGN KEY `tugas_praktikum_id_fkey`;

-- DropIndex
DROP INDEX `absensi_jadwal_id_fkey` ON `absensi`;

-- DropIndex
DROP INDEX `jadwal_praktikum_id_fkey` ON `jadwal`;

-- DropIndex
DROP INDEX `kuis_praktikum_id_fkey` ON `kuis`;

-- DropIndex
DROP INDEX `mahasiswa_praktikum_id_fkey` ON `mahasiswa`;

-- DropIndex
DROP INDEX `modul_praktikum_id_fkey` ON `modul`;

-- DropIndex
DROP INDEX `pengumpulan_tugas_id_fkey` ON `pengumpulan`;

-- DropIndex
DROP INDEX `pengumuman_praktikum_id_fkey` ON `pengumuman`;

-- DropIndex
DROP INDEX `tugas_praktikum_id_fkey` ON `tugas`;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modul` ADD CONSTRAINT `modul_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tugas` ADD CONSTRAINT `tugas_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengumpulan` ADD CONSTRAINT `pengumpulan_tugas_id_fkey` FOREIGN KEY (`tugas_id`) REFERENCES `tugas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `absensi` ADD CONSTRAINT `absensi_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kuis` ADD CONSTRAINT `kuis_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
