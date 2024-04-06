/*
  Warnings:

  - You are about to drop the column `medicationId` on the `prescription` table. All the data in the column will be lost.
  - Added the required column `available` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_medicationId_fkey`;

-- AlterTable
ALTER TABLE `medication` ADD COLUMN `available` BOOLEAN NOT NULL,
    ADD COLUMN `prescriptionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `prescription` DROP COLUMN `medicationId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `clinicId` INTEGER NULL,
    MODIFY `role` ENUM('ADMIN', 'DOCTOR', 'PSYCHOLOGIST') NOT NULL;

-- AlterTable
ALTER TABLE `visit` ADD COLUMN `clinicId` INTEGER NOT NULL,
    ADD COLUMN `prescriptionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Clinic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `Clinic`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medication` ADD CONSTRAINT `Medication_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
