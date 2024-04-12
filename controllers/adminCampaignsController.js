const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");

class AdminCampaignsController {
  async adminCampaignsGet(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const loggedInUser = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
          select: {
            id: true,
            email: true,
            password: true,
            campaigns: {
              select: {
                id: true,
                campaignName: true,
                campaignDescription: true,
                crmFields: true,
              },
            },
          },
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        response.success(res, "Campaigns fetched", {
          ...adminDataWithoutPassword,
        });
      } else {
        response.error("user not already logged in.");
      }
    } catch (error) {
      console.log("error while getting admin campaigns", error);
    }
  }
}

module.exports = new AdminCampaignsController();
