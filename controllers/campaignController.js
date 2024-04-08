const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class CampaignController {
  async campaignCreatePost(req, res) {
    try {
      const { campaignName, campaignDescription, campaignType } = req.body;

      const token = req.cookies.token;

      // admin that is creating the user
      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const alreadyExists = await prisma.campaign.findFirst({
        where: {
          adminId: adminUser.id,
          campaignName,
        },
      });

      if (alreadyExists) {
        res.json({
          message: "Campaign with same name already exists!",
          data: alreadyExists,
          status: "failure",
        });
      } else {
        const newCampaign = await prisma.campaign.create({
          data: {
            campaignName,
            campaignDescription,
            campaignType,
            adminId: adminUser.id,
          },
        });

        res.json({
          message: "new campaign created!",
          data: newCampaign,
          status: "success",
        });
      }
    } catch (error) {
      console.log("error while creating campaign ->", error);
    }
  }

  async campaignUpdatePatch(req, res) {
    try {
      const { campaignName, campaignDescription, campaignType } = req.body;
      const { campaignId } = req.params;

      const token = req.cookies.token;

      // admin that is creating the campaign
      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      // finding campaign from id
      const campaignFound = await prisma.campaign.findFirst({
        where: {
          id: parseInt(campaignId),
        },
      });

      const alreadyExists = await prisma.campaign.findFirst({
        where: {
          adminId: adminUser.id,
          campaignName,
        },
      });

      if (campaignFound) {
        if (alreadyExists) {
          res.json({
            message: "Campaign with same name already exists!",
            data: alreadyExists,
            status: "failure",
          });
        } else {
          const updatedCampaign = await prisma.campaign.update({
            where: {
              id: parseInt(campaignId),
            },
            data: {
              campaignName,
              campaignDescription,
              campaignType,
            },
          });

          res.json({
            message: "campaign updated successfully!",
            data: { updatedCampaign },
            status: "success",
          });
        }
      } else {
        res.json({ message: "campaign not found!", status: "failure" });
      }
    } catch (error) {
      console.log("error while updating campaign ", error);
    }
  }
  async campaignRemoveDelete(req, res) {
    try {
      const { campaignId } = req.params;

      // finding campaign from campaignId
      const campaignFound = await prisma.campaign.findFirst({
        where: {
          id: parseInt(campaignId),
        },
      });

      if (campaignFound) {
        const deletedCampaign = await prisma.campaign.delete({
          where: {
            id: parseInt(campaignId),
          },
        });

        res.status(201).json({
          message: "campaign deleted successfully!",
          data: { deletedCampaign },
          status: "success",
        });
      } else {
        res
          .status(404)
          .json({ message: "campaign does not exist!", status: "failure" });
      }
    } catch (error) {
      console.log("error while deleting campaign ", error);
    }
  }
}

module.exports = new CampaignController();
