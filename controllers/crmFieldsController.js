const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class CRMFieldsController {
  async crmFieldsCreatePost(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { campaignId, adminId } = req.params;

      const admin = await prisma.admin.findFirst({
        where: {
          id: parseInt(adminId),
        },
        select: {
          id: true,
          username: true,
          campaigns: {
            select: {
              id: true,
              campaignName: true,
              crmFields: true,
            },
          },
        },
      });

      // const campaign = admin?.campaigns?.filter((campaign) => {
      //   if (parseInt(campaignId) === campaign.id) {
      //     return campaign;
      //   }
      // });

      // const alreadyExistedField = campaign[0]?.crmFields?.filter((crmField) => {
      //   if (crmField.caption === caption) {
      //     return crmField;
      //   }
      // });

      const campaign = admin?.campaigns?.find(
        (campaign) => parseInt(campaignId) === campaign.id
      );

      const alreadyExistedField = campaign?.crmFields?.find(
        (crmField) => crmField.caption === caption
      );

      const alreadyExistOnSamePosition = campaign?.crmFields?.find(
        (crmField) => crmField.position === position
      );

      console.log(
        "already exist on same position ->",
        alreadyExistOnSamePosition
      );

      if (alreadyExistedField) {
        if (alreadyExistedField.caption === caption) {
          res.json({
            message: "Field with same caption already exists in this campaign.",
            data: alreadyExistedField,
            status: "failure",
          });
        }
      } else if (alreadyExistOnSamePosition) {
        // Create the new CRM field with the same position
        const newCRMField = await prisma.CRMField.create({
          data: {
            caption,
            type,
            required: required === "true" ? true : false,
            readOnly: readOnly === "true" ? true : false,
            position: alreadyExistOnSamePosition.position, // Set position to existing position
            campaignId: parseInt(campaignId),
          },
        });

        // Update positions of other CRM fields
        await prisma.CRMField.updateMany({
          where: {
            AND: [
              { campaignId: parseInt(campaignId) },
              { position: { gte: position } },
              { id: { not: newCRMField.id } },
            ],
          },
          data: {
            position: { increment: 1 },
          },
        });

        // Retrieve all CRM fields for the campaign after position update
        const allCampaignFields = await prisma.campaign
          .findFirst({
            where: { id: parseInt(campaignId) },
          })
          .crmFields();

        res.json({
          message:
            "New CRM field created with the same position and positions updated.",
          data: allCampaignFields,
          status: "positions-updated",
        });
      } else {
        const newCRMField = await prisma.CRMField.create({
          data: {
            caption,
            type,
            required: required === "true" ? true : false,
            readOnly: readOnly === "true" ? true : false,
            position,
            campaignId: parseInt(campaignId),
          },
        });

        res.status(201).json({
          message: "new crm field created!",
          data: newCRMField,
          status: "success",
        });
      }
    } catch (error) {
      console.log("error while creating crm field ->", error);
    }
  }
  async crmFieldsUpdatePatch(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { crmFieldId } = req.params;

      // finding crmfield from id
      const crmFieldFound = await prisma.CRMField.findFirst({
        where: {
          id: parseInt(crmFieldId),
        },
      });

      if (crmFieldFound) {
        const updatedData = await prisma.CRMField.update({
          where: {
            id: parseInt(crmFieldId),
          },
          data: {
            caption,
            type,
            required: required === "true" ? true : false,
            readOnly: readOnly === "true" ? true : false,
            position,
          },
        });

        res.json({
          message: "crm field updated successfully!",
          data: updatedData,
          status: "success",
        });
      } else {
        res.json({ message: "crm field not found!", status: "failure" });
      }
    } catch (error) {
      console.log("error while updating crm field ", error);
    }
  }

  async crmFieldsRemoveDelete(req, res) {
    try {
      const { crmFieldId } = req.params;

      // finding crm field from crmFieldId
      const crmFieldFound = await prisma.CRMField.findFirst({
        where: {
          id: parseInt(crmFieldId),
        },
      });

      if (crmFieldFound) {
        const deletedCampaign = await prisma.CRMField.delete({
          where: {
            id: parseInt(crmFieldId),
          },
        });

        res.status(201).json({
          message: "crmField deleted successfully!",
          data: { deletedCampaign },
          status: "success",
        });
      } else {
        res
          .status(404)
          .json({ message: "crmField does not exist!", status: "failure" });
      }
    } catch (error) {
      console.log("error while deleting crm field ", error);
    }
  }
}

module.exports = new CRMFieldsController();
