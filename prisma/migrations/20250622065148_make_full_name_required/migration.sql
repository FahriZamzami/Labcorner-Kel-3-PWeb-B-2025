/*
  Warnings:

  - Made the column `fullName` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `fullName` VARCHAR(191) NOT NULL;
