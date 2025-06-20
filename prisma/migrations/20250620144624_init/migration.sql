/*
  Warnings:

  - You are about to drop the `pendaftaran` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `pendaftaran_praktikum_id_fkey`;

-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `pendaftaran_user_id_fkey`;

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

-- AddForeignKey
ALTER TABLE `asistenLab` ADD CONSTRAINT `asistenLab_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistenLab` ADD CONSTRAINT `asistenLab_lab_id_fkey` FOREIGN KEY (`lab_id`) REFERENCES `lab`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
