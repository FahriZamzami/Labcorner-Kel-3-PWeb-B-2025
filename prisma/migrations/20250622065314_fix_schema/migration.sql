-- AlterTable
ALTER TABLE `jadwal` ADD COLUMN `namaLab` VARCHAR(191) NULL,
    ADD COLUMN `semester` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `nilai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `jadwal_id` INTEGER NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `skor` DOUBLE NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nilai` ADD CONSTRAINT `nilai_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
