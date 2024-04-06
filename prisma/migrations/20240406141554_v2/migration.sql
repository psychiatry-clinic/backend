/*
  Warnings:

  - You are about to drop the column `educatiob` on the `demographics` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `clinicId` on the `visit` table. All the data in the column will be lost.
  - You are about to drop the `clinic` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `education` to the `Demographics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinic` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinic` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_clinicId_fkey`;

-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_clinicId_fkey`;

-- DropForeignKey
ALTER TABLE `visit` DROP FOREIGN KEY `Visit_psychologistId_fkey`;

-- AlterTable
ALTER TABLE `demographics` DROP COLUMN `educatiob`,
    ADD COLUMN `education` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `clinicId`,
    ADD COLUMN `clinic` ENUM('Kadhimiya', 'BaghdadTeachingHospital', 'AutismCenter') NOT NULL;

-- AlterTable
ALTER TABLE `visit` DROP COLUMN `clinicId`,
    ADD COLUMN `clinic` ENUM('Kadhimiya', 'BaghdadTeachingHospital', 'AutismCenter') NOT NULL;

-- DropTable
DROP TABLE `clinic`;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notes` VARCHAR(191) NOT NULL,
    `clinic` ENUM('Kadhimiya', 'BaghdadTeachingHospital', 'AutismCenter') NOT NULL,
    `psychologistId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_psychologistId_fkey` FOREIGN KEY (`psychologistId`) REFERENCES `Psychologist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
