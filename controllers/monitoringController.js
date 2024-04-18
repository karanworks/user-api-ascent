const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class MonitoringController {
  async monitoringData(req, res) {
    try {
      const { campaigns } = req.body;
      const uniqueUsers = [];

      const assignedCampaigns = await prisma.campaignAssign.findMany({
        where: {
          campaignId: {
            in: campaigns,
          },
        },
      });

      if (assignedCampaigns.length === 0) {
        console.log("No assigned campaigns found.");
        return; // Exit the function or handle the scenario appropriately
      }

      await Promise.all(
        assignedCampaigns.map(async (assignedCampaign) => {
          const campaign = await prisma.campaign.findFirst({
            where: {
              id: assignedCampaign.campaignId,
            },
          });

          const user = await prisma.user.findFirst({
            where: {
              id: assignedCampaign.userId,
            },
          });

          const userIndex = uniqueUsers.findIndex((u) => u.userId === user.id);

          if (userIndex === -1) {
            uniqueUsers.push({
              userId: user.id,
              name: user.username,
              campaignId: [campaign.id],
              campaignName: [campaign.campaignName],
            });
          } else {
            uniqueUsers[userIndex].campaignId.push(campaign.id);
            if (
              !uniqueUsers[userIndex].campaignName.includes(
                campaign.campaignName
              )
            ) {
              uniqueUsers[userIndex].campaignName.push(campaign.campaignName);
            }
          }
          return Promise.resolve(); // Ensure each iteration returns a promise
        })
      );

      console.log("unique users here ->", uniqueUsers);
    } catch (error) {
      console.log("error in monitoring data", error);
    }
  }
}

module.exports = new MonitoringController();
