const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const session = require("../utils/session");

class AdminCampaignsController {
  async adminCampaignsGet(req, res) {
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
              campaigns: {
                select: {
                  id: true,
                  campaignName: true,
                  campaignDescription: true,
                  crmFields: true,
                  dispositions: true,
                },
              },
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "Campaigns fetched", {
            ...adminDataWithoutPassword,
          });
        } else {
          response.error(res, "User not active!");
        }
      } else {
        response.error(res, "user not already logged in.");
      }
    } catch (error) {
      console.log("error while getting admin campaigns", error);
    }
  }
}

module.exports = new AdminCampaignsController();
