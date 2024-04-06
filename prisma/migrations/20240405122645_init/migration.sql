/*
  Warnings:

  - You are about to drop the column `time` on the `visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `visit` DROP COLUMN `time`,
    MODIFY `duration` INTEGER NULL;
