/*
  Warnings:

  - A unique constraint covering the columns `[nama_lab]` on the table `lab` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `lab_nama_lab_key` ON `lab`(`nama_lab`);
