/*
  Warnings:

  - You are about to drop the column `user_id` on the `jadwal` table. All the data in the column will be lost.
  - The primary key for the `lab` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_lab` on the `lab` table. All the data in the column will be lost.
  - You are about to drop the column `diunggah_oleh` on the `modul` table. All the data in the column will be lost.
  - You are about to alter the column `lab_id` on the `praktikum` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `dibuat_oleh` on the `tugas` table. All the data in the column will be lost.
  - You are about to drop the `pendaftaran` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kode_masuk]` on the table `praktikum` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dibuat_pada` on table `jadwal` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `id` to the `lab` table without a default value. This is not possible if the table is not empty.
  - Made the column `diunggah_pada` on table `modul` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `kode_masuk` to the `praktikum` table without a default value. This is not possible if the table is not empty.
  - Made the column `batas_waktu` on table `tugas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dibuat_pada` on table `tugas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `jadwal` DROP FOREIGN KEY `jadwal_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `modul` DROP FOREIGN KEY `modul_diunggah_oleh_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `pendaftaran_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `pendaftaran_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `praktikum` DROP FOREIGN KEY `praktikum_lab_id_fkey`;

-- DropForeignKey
ALTER TABLE `tugas` DROP FOREIGN KEY `tugas_dibuat_oleh_fkey`;

-- DropIndex
DROP INDEX `jadwal_user_id_fkey` ON `jadwal`;

-- DropIndex
DROP INDEX `modul_diunggah_oleh_fkey` ON `modul`;

-- DropIndex
DROP INDEX `praktikum_lab_id_fkey` ON `praktikum`;

-- DropIndex
DROP INDEX `tugas_dibuat_oleh_fkey` ON `tugas`;

-- AlterTable
ALTER TABLE `jadwal` DROP COLUMN `user_id`,
    ADD COLUMN `materi` VARCHAR(191) NULL,
    MODIFY `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `lab` DROP PRIMARY KEY,
    DROP COLUMN `id_lab`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `modul` DROP COLUMN `diunggah_oleh`,
    MODIFY `diunggah_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `praktikum` ADD COLUMN `kode_masuk` VARCHAR(191) NOT NULL,
    MODIFY `lab_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tugas` DROP COLUMN `dibuat_oleh`,
    ADD COLUMN `fileTugas` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('open', 'close') NOT NULL DEFAULT 'open',
    ADD COLUMN `tutup_penugasan` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `batas_waktu` DATETIME(3) NOT NULL,
    MODIFY `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `pendaftaran`;

-- CreateTable
CREATE TABLE `asistenLab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `lab_id` INTEGER NOT NULL,

    UNIQUE INDEX `asistenLab_user_id_lab_id_key`(`user_id`, `lab_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `praktikum_id` INTEGER NOT NULL,
    `waktu_daftar` DATETIME(3) NULL,

    UNIQUE INDEX `mahasiswa_user_id_praktikum_id_key`(`user_id`, `praktikum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `praktikum_kode_masuk_key` ON `praktikum`(`kode_masuk`);

-- AddForeignKey
ALTER TABLE `asistenLab` ADD CONSTRAINT `asistenLab_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistenLab` ADD CONSTRAINT `asistenLab_lab_id_fkey` FOREIGN KEY (`lab_id`) REFERENCES `lab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `praktikum` ADD CONSTRAINT `praktikum_lab_id_fkey` FOREIGN KEY (`lab_id`) REFERENCES `lab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
