/*
  Warnings:

  - Added the required column `key` to the `Clinic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Clinic` ADD COLUMN `key` VARCHAR(191) NOT NULL;
