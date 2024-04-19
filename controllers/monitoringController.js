const { PrismaClient } = require("@prisma/client");
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const prisma = new PrismaClient();

class MonitoringController {
  async monitoringGet(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const { isActive } = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
        });

        if (isActive) {
          // DO SOMETHING IN FUTURE
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "User not logged in!");
      }
    } catch (error) {
      console.log("error in get monitoring data ->", error);
    }
  }

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
        return;
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

      response.success(res, "Users fetched successflly", {
        users: uniqueUsers,
      });
    } catch (error) {
      console.log("error in monitoring data", error);
    }
  }
}

module.exports = new MonitoringController();
