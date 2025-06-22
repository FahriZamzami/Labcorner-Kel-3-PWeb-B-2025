/*
  Warnings:

  - Made the column `dibuat_pada` on table `pengumuman` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `pengumuman` DROP FOREIGN KEY `pengumuman_praktikum_id_fkey`;

-- DropIndex
DROP INDEX `pengumuman_praktikum_id_fkey` ON `pengumuman`;

-- AlterTable
ALTER TABLE `pengumuman` MODIFY `praktikum_id` INTEGER NULL,
    MODIFY `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `downloadTracking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modul_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `praktikum_id` INTEGER NOT NULL,
    `downloaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downloadTracking` ADD CONSTRAINT `downloadTracking_modul_id_fkey` FOREIGN KEY (`modul_id`) REFERENCES `modul`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downloadTracking` ADD CONSTRAINT `downloadTracking_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `downloadTracking` ADD CONSTRAINT `downloadTracking_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
