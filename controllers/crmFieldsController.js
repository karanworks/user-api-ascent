const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const response = require("../utils/response");

const getLoggedInUser = require("../utils/getLoggedInUser");

class CRMFieldsController {
  async crmFieldsCreatePost(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { campaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const admin = await prisma.user.findFirst({
        where: {
          id: loggedInUser.id,
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

      const campaign = admin?.campaigns?.find(
        (campaign) => parseInt(campaignId) === campaign.id
      );

      const alreadyExistedField = campaign?.crmFields?.find(
        (crmField) => crmField.caption === caption
      );

      const alreadyExistOnSamePosition = campaign?.crmFields?.find(
        (crmField) => crmField.position === position
      );

      if (alreadyExistedField) {
        if (alreadyExistedField.caption === caption) {
          response.error(
            res,
            "Field with same caption already exists in this campaign.",
            alreadyExistedField
          );
        }
      } else if (alreadyExistOnSamePosition) {
        // Create the new CRM field with the same position
        const newCRMField = await prisma.CRMField.create({
          data: {
            caption,
            type,
            required: required === "true" ? true : false,
            readOnly: readOnly === "true" ? true : false,
            position, // Set position to existing position
            campaignId: parseInt(campaignId),
          },
        });

        // Update positions of other CRM fields
        const updatedPositions = await prisma.CRMField.updateMany({
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
          .crmFields()
          .then((fields) => fields.sort((a, b) => a.position - b.position));

        response.success(
          res,
          "New CRM field created with the same position and positions updated.",
          allCampaignFields,
          "positions-updated"
        );
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

        response.success(res, "New crm field created!", newCRMField);
      }
    } catch (error) {
      console.log("error while creating crm field ->", error);
    }
  }

  async crmFieldsUpdatePatch(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { crmFieldId } = req.params;
      let captionUpdated = false;

      // Find the CRM field from the ID
      const crmFieldFound = await prisma.CRMField.findFirst({
        where: {
          id: parseInt(crmFieldId),
        },
      });

      if (!crmFieldFound) {
        return response.error(res, "CRM field not found!");
      }

      const { campaignId } = crmFieldFound;

      const loggedInUser = await getLoggedInUser(req, res);

      // Get the admin and campaign information
      const admin = await prisma.user.findFirst({
        where: {
          id: loggedInUser.id,
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

      const campaign = admin?.campaigns?.find(
        (campaign) => parseInt(campaignId) === campaign.id
      );

      const alreadyExistedField = campaign?.crmFields?.find(
        (crmField) => crmField.caption === caption
      );

      const alreadyExistOnSamePosition = campaign?.crmFields?.find(
        (crmField) =>
          crmField.position === position && crmField.id !== parseInt(crmFieldId)
      );

      if (crmFieldFound.caption === caption) {
        captionUpdated = true;
      }

      if (!captionUpdated && alreadyExistedField) {
        return response.error(
          res,
          "Field with the same caption already exists in this campaign.",
          alreadyExistedField
        );
      } else if (alreadyExistOnSamePosition) {
        if (crmFieldFound.position < position) {
          const nextField = await prisma.CRMField.findFirst({
            where: {
              position,
            },
          });

          await prisma.CRMField.update({
            where: {
              id: nextField.id,
            },
            data: {
              position: crmFieldFound.position,
            },
          });

          await prisma.CRMField.update({
            where: {
              id: crmFieldFound.id,
            },
            data: {
              position: nextField.position,
            },
          });

          // Retrieve all CRM fields for the campaign after position update
          const allCampaignFields = await prisma.campaign
            .findFirst({
              where: { id: parseInt(campaignId) },
            })
            .crmFields()
            .then((fields) => fields.sort((a, b) => a.position - b.position));

          response.success(
            res,
            "CRM field updated successfully!",
            allCampaignFields,
            "positions-updated"
          );
        } else if (crmFieldFound.position > position) {
          const prevField = await prisma.CRMField.findFirst({
            where: {
              position: position,
            },
          });

          const prevFieldUpdated = await prisma.CRMField.update({
            where: {
              id: prevField.id,
            },
            data: {
              position: crmFieldFound.position,
            },
          });

          const currentFieldUpdated = await prisma.CRMField.update({
            where: {
              id: crmFieldFound.id,
            },
            data: {
              position: prevField.position,
            },
          });

          // Retrieve all CRM fields for the campaign after position update
          const allCampaignFields = await prisma.campaign
            .findFirst({
              where: { id: parseInt(campaignId) },
            })
            .crmFields()
            .then((fields) => fields.sort((a, b) => a.position - b.position));

          response.success(
            res,
            "CRM field updated successfully!",
            allCampaignFields,
            "positions-updated"
          );
        }
      } else {
        // If there are no conflicts, simply update the CRM field
        await prisma.CRMField.update({
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

        const allCampaignFields = await prisma.campaign
          .findFirst({
            where: { id: parseInt(campaignId) },
          })
          .crmFields()
          .then((fields) => fields.sort((a, b) => a.position - b.position));

        response.success(
          res,
          "CRM field updated successfully!",
          allCampaignFields
        );
      }
    } catch (error) {
      console.log("Error while updating CRM field: ", error);

      response.error(res, "Internal server error");
    }
  }

  async crmFieldsRemoveDelete(req, res) {
    try {
      const { crmFieldId, campaignId } = req.params;

      // finding crm field from crmFieldId
      const crmFieldFound = await prisma.CRMField.findFirst({
        where: {
          id: parseInt(crmFieldId),
        },
      });

      if (crmFieldFound) {
        await prisma.CRMField.delete({
          where: {
            id: parseInt(crmFieldId),
          },
        });

        await prisma.CRMField.updateMany({
          where: {
            position: {
              gt: crmFieldFound.position,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });

        const allCampaignFields = await prisma.campaign
          .findFirst({
            where: { id: parseInt(campaignId) },
          })
          .crmFields()
          .then((fields) => fields.sort((a, b) => a.position - b.position));

        response.success(
          res,
          "CRMField deleted successfully!",
          allCampaignFields
        );
      } else {
        response.error(res, "crmField does not exist!");
      }
    } catch (error) {
      console.log("error while deleting crm field ", error);
    }
  }
}

module.exports = new CRMFieldsController();
