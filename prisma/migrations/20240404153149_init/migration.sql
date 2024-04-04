/*
  Warnings:

  - You are about to drop the column `email` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `patient` table. All the data in the column will be lost.
  - You are about to alter the column `gender` on the `patient` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `patientId` on the `user` table. All the data in the column will be lost.
  - The values [PATIENT] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `appointment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `medication` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_patientId_fkey`;

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `email`,
    DROP COLUMN `specialty`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `medication` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `address`,
    DROP COLUMN `age`,
    DROP COLUMN `email`,
    ADD COLUMN `dob` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `gender` ENUM('Male', 'Female') NOT NULL;

-- AlterTable
ALTER TABLE `prescription` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `patientId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `patientId`,
    ADD COLUMN `psychologistId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `role` ENUM('DOCTOR', 'PSYCHOLOGIST') NOT NULL;

-- DropTable
DROP TABLE `appointment`;

-- CreateTable
CREATE TABLE `Psychologist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Demographics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NULL,
    `address` VARCHAR(191) NOT NULL,
    `marital_status` VARCHAR(191) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `children` VARCHAR(191) NOT NULL,
    `residence` VARCHAR(191) NOT NULL,
    `educatiob` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `patientId` INTEGER NOT NULL,
    `doctorId` INTEGER NULL,
    `psychologistId` INTEGER NULL,
    `time` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `chief_complaint` VARCHAR(191) NOT NULL,
    `present_illness` VARCHAR(191) NOT NULL,
    `suicide` VARCHAR(191) NOT NULL,
    `family_hx` VARCHAR(191) NOT NULL,
    `past_psychiatric_hx` VARCHAR(191) NOT NULL,
    `past_medical_hx` VARCHAR(191) NOT NULL,
    `forensic_hx` VARCHAR(191) NOT NULL,
    `social_hx` VARCHAR(191) NOT NULL,
    `drug_hx` VARCHAR(191) NOT NULL,
    `substance` VARCHAR(191) NOT NULL,
    `personal_hx` VARCHAR(191) NOT NULL,
    `appearance` VARCHAR(191) NOT NULL,
    `behavior` VARCHAR(191) NOT NULL,
    `speech` VARCHAR(191) NOT NULL,
    `mood` VARCHAR(191) NOT NULL,
    `thought_form` VARCHAR(191) NOT NULL,
    `thought_content` VARCHAR(191) NOT NULL,
    `perception` VARCHAR(191) NOT NULL,
    `cognitive_state` VARCHAR(191) NOT NULL,
    `differential_diagnosis` VARCHAR(191) NOT NULL,
    `management` VARCHAR(191) NOT NULL,
    `lab_tests` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `insight` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_psychologistId_fkey` FOREIGN KEY (`psychologistId`) REFERENCES `Psychologist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demographics` ADD CONSTRAINT `Demographics_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_psychologistId_fkey` FOREIGN KEY (`psychologistId`) REFERENCES `Psychologist`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
