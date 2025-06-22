/*
  Warnings:

  - Made the column `dibuat_pada` on table `jadwal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `jadwal` MODIFY `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
