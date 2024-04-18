/*
  Warnings:

  - Added the required column `disposition` to the `CRMFormData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDisposition` to the `CRMFormData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `crmformdata` ADD COLUMN `disposition` VARCHAR(191) NOT NULL,
    ADD COLUMN `subDisposition` VARCHAR(191) NOT NULL;
