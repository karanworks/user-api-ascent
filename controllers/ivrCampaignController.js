const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const session = require("../utils/session");

class IVRCampaignController {
  async ivrCampaignCreatePost(req, res) {
    try {
      const { ivrCampaignName, ivrCampaignDescription } = req.body;

      const token = await getToken(req, res);

      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const alreadyExists = await prisma.ivrCampaign.findFirst({
        where: {
          adminId: adminUser.id,
          ivrCampaignName,
        },
      });

      if (alreadyExists) {
        response.error(
          res,
          "IVR Campaign with same name already exists!",
          alreadyExists
        );
      } else {
        const newCampaign = await prisma.ivrCampaign.create({
          data: {
            ivrCampaignName,
            ivrCampaignDescription,
            adminId: adminUser.id,
          },
        });

        response.success(res, "new IVR campaign created!", newCampaign);
      }
    } catch (error) {
      console.log("error while creating IVR campaign ->", error);
    }
  }

  async ivrCampaignUpdatePatch(req, res) {
    try {
      const { ivrCampaignName, ivrCampaignDescription } = req.body;
      const { ivrCampaignId } = req.params;

      const token = await getToken(req, res);

      // admin that is creating the campaign
      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const ivrCampaignFound = await prisma.ivrCampaign.findFirst({
        where: {
          id: parseInt(ivrCampaignId),
        },
      });

      const alreadyExists = await prisma.ivrCampaign.findFirst({
        where: {
          adminId: adminUser.id,
          ivrCampaignName,
        },
      });

      if (ivrCampaignFound) {
        if (alreadyExists) {
          response.error(
            res,
            "IVR Campaign with same name already exists!",
            alreadyExists
          );
        } else {
          const updatedCampaign = await prisma.ivrCampaign.update({
            where: {
              id: parseInt(ivrCampaignId),
            },
            data: {
              ivrCampaignName,
              ivrCampaignDescription,
            },
          });

          response.success(res, "IVR Campaign updated successfully", {
            updatedCampaign,
          });
        }
      } else {
        response.error(res, "IVR Campaign not found!");
      }
    } catch (error) {
      console.log("error while updating IVR campaign ", error);
    }
  }

  async ivrCampaignRemoveDelete(req, res) {
    try {
      const { ivrCampaignId } = req.params;

      // finding campaign from campaignId
      const campaignFound = await prisma.ivrCampaign.findFirst({
        where: {
          id: parseInt(ivrCampaignId),
        },
      });

      if (campaignFound) {
        const deletedCampaign = await prisma.ivrCampaign.delete({
          where: {
            id: parseInt(ivrCampaignId),
          },
        });

        response.success(res, "IVR Campaign deleted successfully!", {
          deletedCampaign,
        });
      } else {
        response.error(res, "IVR Campaign does not exist!");
      }
    } catch (error) {
      console.log("error while deleting IVR campaign ", error);
    }
  }

  async ivrCampaignGet(req, res) {
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
              ivrCampaigns: {
                select: {
                  id: true,
                  ivrCampaignName: true,
                  ivrCampaignDescription: true,
                },
              },
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          const lastActiveTime = await session(
            loggedInUser.adminId,
            loggedInUser.id
          );

          response.success(res, "IVR Campaigns fetched", {
            ...adminDataWithoutPassword,
            lastActiveTime,
          });
        } else {
          response.error(res, "User not active!");
        }
      } else {
        response.error(res, "user not already logged in.");
      }
    } catch (error) {
      console.log("error while getting IVR campaigns", error);
    }
  }
}

module.exports = new IVRCampaignController();
