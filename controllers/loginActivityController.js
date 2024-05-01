const { PrismaClient } = require("@prisma/client");
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const session = require("../utils/session");
const prisma = new PrismaClient();

class LoginActivityController {
  async loginActivityGet(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const loggedInUser = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
        });

        if (loggedInUser.isActive) {
          // DO SOMETHING IN FUTURE

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(
            res,
            "nothing to do in loginActivity get api, will do something in future"
          );
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "User not logged in!");
      }
    } catch (error) {
      console.log("error in get loginactivity get ->", error);
    }
  }

  async loginActivityDataPost(req, res) {
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

      for (const assignedCampaign of assignedCampaigns) {
        try {
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

          // login activity (login, logout timing)
          const loginActivity = await prisma.loginActivity.findFirst({
            where: {
              userId: user?.id,
            },
          });

          if (userIndex === -1) {
            uniqueUsers.push({
              userId: user?.id,
              name: user?.username,
              campaignId: [campaign?.id],
              campaignName: [campaign?.campaignName],
              loginTime: loginActivity?.loginTime || null,
              logoutTime: loginActivity?.logoutTime || null,
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
        } catch (error) {
          console.log("Error processing assigned campaign:", error);
        }
      }

      response.success(res, "Users fetched successfully", {
        users: uniqueUsers,
      });
    } catch (error) {
      console.log("error in login activity data post -> ", error);
    }
  }
}

module.exports = new LoginActivityController();
