-- CreateTable
CREATE TABLE `kuis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `praktikum_id` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `waktu_mulai` DATETIME(3) NOT NULL,
    `waktu_selesai` DATETIME(3) NOT NULL,
    `durasi_menit` INTEGER NOT NULL DEFAULT 60,
    `status` ENUM('aktif', 'tidak_aktif') NOT NULL DEFAULT 'tidak_aktif',
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pertanyaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kuis_id` INTEGER NOT NULL,
    `pertanyaan` VARCHAR(191) NOT NULL,
    `tipe` ENUM('pilihan_ganda', 'benar_salah', 'essay') NOT NULL,
    `opsi_a` VARCHAR(191) NULL,
    `opsi_b` VARCHAR(191) NULL,
    `opsi_c` VARCHAR(191) NULL,
    `opsi_d` VARCHAR(191) NULL,
    `opsi_e` VARCHAR(191) NULL,
    `jawaban_benar` VARCHAR(191) NOT NULL,
    `poin` INTEGER NOT NULL DEFAULT 1,
    `urutan` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jawabanKuis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kuis_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `waktu_mulai` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `waktu_selesai` DATETIME(3) NULL,
    `total_poin` DOUBLE NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'sedang_berlangsung',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jawabanPertanyaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jawaban_kuis_id` INTEGER NOT NULL,
    `pertanyaan_id` INTEGER NOT NULL,
    `jawaban_user` VARCHAR(191) NULL,
    `poin_didapat` DOUBLE NULL,
    `waktu_jawab` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kuis` ADD CONSTRAINT `kuis_praktikum_id_fkey` FOREIGN KEY (`praktikum_id`) REFERENCES `praktikum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pertanyaan` ADD CONSTRAINT `pertanyaan_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawabanKuis` ADD CONSTRAINT `jawabanKuis_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `kuis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawabanKuis` ADD CONSTRAINT `jawabanKuis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawabanPertanyaan` ADD CONSTRAINT `jawabanPertanyaan_jawaban_kuis_id_fkey` FOREIGN KEY (`jawaban_kuis_id`) REFERENCES `jawabanKuis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jawabanPertanyaan` ADD CONSTRAINT `jawabanPertanyaan_pertanyaan_id_fkey` FOREIGN KEY (`pertanyaan_id`) REFERENCES `pertanyaan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
