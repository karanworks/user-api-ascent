-- AlterTable
ALTER TABLE `disposition` MODIFY `campaignId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Disposition` ADD CONSTRAINT `Disposition_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `Campaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
