/*
  Warnings:

  - You are about to drop the column `lab_tests` on the `visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `test` ADD COLUMN `visitId` INTEGER NULL;

-- AlterTable
ALTER TABLE `visit` DROP COLUMN `lab_tests`,
    MODIFY `notes` VARCHAR(191) NULL,
    MODIFY `insight` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Test` ADD CONSTRAINT `Test_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
