/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - Added the required column `subMenuId` to the `SubMenuAssign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `submenu` DROP FOREIGN KEY `SubMenu_menuId_fkey`;

-- AlterTable
ALTER TABLE `role` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `submenuassign` ADD COLUMN `subMenuId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL;
