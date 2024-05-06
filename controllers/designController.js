const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const session = require("../utils/session");
class DesignController {
  async getDesign(req, res) {
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
              ivrCampaigns: {
                select: {
                  id: true,
                  ivrCampaignName: true,
                  ivrCampaignDescription: true,
                  numbers: true,
                  speeches: true,
                },
              },
              designs: true,
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "IVR Design fetched", {
            ...adminDataWithoutPassword,
          });
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "user not logged in.");
      }
    } catch (error) {
      console.log("error while getting IVR Design data", error);
    }
  }

  async createDesignPost(req, res) {
    try {
      const { audioText, audioFile, ivrCampaignId, key, parentId } = req.body;

      const token = await getToken(req, res);

      console.log("parent here ->", parentId);

      // admin that is creating the user
      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      if (adminUser) {
        const newIvrDesign = await prisma.ivrDesign.create({
          data: {
            audioText,
            ivrCampaignId,
            key,
            createdBy: adminUser.id,
            parentId: parentId ? parentId : null,
          },
        });

        response.success(res, "new ivr design created!", newIvrDesign);
      } else {
        response.error(res, "User doesn't exist!");
      }
    } catch (error) {
      console.log("error while creating ivr design ->", error);
    }
  }
}

module.exports = new DesignController();
