/*
  Warnings:

  - A unique constraint covering the columns `[kode_masuk]` on the table `praktikum` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `praktikum` ADD COLUMN `kode_masuk` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `praktikum_kode_masuk_key` ON `praktikum`(`kode_masuk`);
