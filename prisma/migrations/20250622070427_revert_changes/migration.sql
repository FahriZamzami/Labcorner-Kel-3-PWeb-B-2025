/*
  Warnings:

  - You are about to drop the column `namaLab` on the `jadwal` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `jadwal` table. All the data in the column will be lost.
  - You are about to drop the `nilai` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `nilai` DROP FOREIGN KEY `nilai_jadwal_id_fkey`;

-- DropForeignKey
ALTER TABLE `nilai` DROP FOREIGN KEY `nilai_user_id_fkey`;

-- AlterTable
ALTER TABLE `jadwal` DROP COLUMN `namaLab`,
    DROP COLUMN `semester`;

-- DropTable
DROP TABLE `nilai`;
