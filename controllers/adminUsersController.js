const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const session = require("../utils/session");

class AdminUsers {
  async adminUsersGet(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const { isActive } = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
        });

        if (isActive) {
          const loggedInUser = await prisma.user.findFirst({
            where: {
              token: parseInt(token),
            },
            select: {
              id: true,
              email: true,
              password: true,
              adminId: true,
            },
          });

          const users = await prisma.user.findMany({
            where: {
              adminId: loggedInUser.id,
            },
            select: {
              id: true,
              username: true,
              password: true,
              email: true,
              agentMobile: true,
              roleId: true,
            },
          });

          const usersWithCampaigns = [];

          for (const user of users) {
            const campaignAssignments = await prisma.campaignAssign.findMany({
              where: {
                userId: user.id,
              },
              select: {
                campaignId: true,
              },
            });

            const campaigns = await prisma.campaign.findMany({
              where: {
                id: {
                  in: campaignAssignments.map((ca) => ca.campaignId),
                },
              },
            });

            usersWithCampaigns.push({
              ...user,
              campaigns,
            });
          }

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "Users fetched", {
            ...adminDataWithoutPassword,
            users: usersWithCampaigns,
          });
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "User not already logged in.");
      }
    } catch (error) {
      console.log("error while getting users", error);
    }
  }
}

module.exports = new AdminUsers();
