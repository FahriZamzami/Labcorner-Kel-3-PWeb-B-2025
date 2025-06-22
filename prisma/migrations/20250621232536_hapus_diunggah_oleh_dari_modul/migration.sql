/*
  Warnings:

  - You are about to drop the column `diunggah_oleh` on the `modul` table. All the data in the column will be lost.
  - Made the column `diunggah_pada` on table `modul` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `modul` DROP FOREIGN KEY `modul_diunggah_oleh_fkey`;

-- DropIndex
DROP INDEX `modul_diunggah_oleh_fkey` ON `modul`;

-- AlterTable
ALTER TABLE `modul` DROP COLUMN `diunggah_oleh`,
    MODIFY `diunggah_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
