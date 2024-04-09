/*
  Warnings:

  - You are about to drop the column `name` on the `menu` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `submenu` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `submenu` table. All the data in the column will be lost.
  - You are about to drop the column `crmEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `crmPassword` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuLableId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `SubMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link` to the `SubMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `SubMenu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submenuLableId` to the `SubMenu` table without a default value. This is not possible if the table is not empty.
  - Made the column `menuId` on table `submenu` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `campaign` DROP FOREIGN KEY `Campaign_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_adminId_fkey`;

-- DropIndex
DROP INDEX `SubMenu_menuId_fkey` ON `submenu`;

-- DropIndex
DROP INDEX `User_crmEmail_key` ON `user`;

-- AlterTable
ALTER TABLE `menu` DROP COLUMN `name`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `menuLableId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `submenu` DROP COLUMN `name`,
    DROP COLUMN `url`,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `link` VARCHAR(191) NOT NULL,
    ADD COLUMN `parentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `submenuLableId` VARCHAR(191) NOT NULL,
    MODIFY `menuId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `crmEmail`,
    DROP COLUMN `crmPassword`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `users` JSON NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `agentMobile` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `admin`;

-- CreateTable
CREATE TABLE `CampaignAssign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Campaign` ADD CONSTRAINT `Campaign_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
