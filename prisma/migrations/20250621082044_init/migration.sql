/*
  Warnings:

  - Made the column `kode_masuk` on table `praktikum` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `praktikum` MODIFY `kode_masuk` VARCHAR(191) NOT NULL;
