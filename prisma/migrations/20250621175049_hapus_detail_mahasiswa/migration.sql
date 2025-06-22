/*
  Warnings:

  - You are about to drop the `detail_mahasiswa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `detail_mahasiswa` DROP FOREIGN KEY `detail_mahasiswa_user_id_fkey`;

-- DropTable
DROP TABLE `detail_mahasiswa`;
