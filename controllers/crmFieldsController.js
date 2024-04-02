const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class CRMFieldsController {
  async crmFieldsCreatePost(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { campaignId, adminId } = req.params;

      const admin = await prisma.user.findFirst({
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

        console.log("updated positions after addition ->", allCampaignFields);

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
      const { crmFieldId, adminId } = req.params;
      let captionUpdated = false;

      // Find the CRM field from the ID
      const crmFieldFound = await prisma.CRMField.findFirst({
        where: {
          id: parseInt(crmFieldId),
        },
      });

      if (!crmFieldFound) {
        return res.json({ message: "CRM field not found!", status: "failure" });
      }

      const { campaignId } = crmFieldFound;

      // Get the admin and campaign information
      const admin = await prisma.user.findFirst({
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

      console.log(
        "already exist on same position ->",
        alreadyExistOnSamePosition
      );

      if (crmFieldFound.caption === caption) {
        captionUpdated = true;
      }

      if (!captionUpdated && alreadyExistedField) {
        return res.json({
          message:
            "Field with the same caption already exists in this campaign.",
          data: alreadyExistedField,
          status: "duplicate",
        });
      } else if (alreadyExistOnSamePosition) {
        if (crmFieldFound.position < position) {
          console.log(
            "if position to be changed is greater than current position."
          );
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

          res.json({
            message: "CRM field updated successfully!",
            data: allCampaignFields,
            status: "positions-updated",
          });
        } else if (crmFieldFound.position > position) {
          console.log(
            "if position to be changed is smaller than current position."
          );
          console.log(
            "field ki current position ->",
            crmFieldFound.position,
            "field ko jis position par karna hai ->",
            position
          );
          const prevField = await prisma.CRMField.findFirst({
            where: {
              position: position,
            },
          });

          console.log("jo us field par already exist krti hai ->", prevField);

          const prevFieldUpdated = await prisma.CRMField.update({
            where: {
              id: prevField.id,
            },
            data: {
              position: crmFieldFound.position,
            },
          });

          console.log(
            "jo us field par already exist krti hai uska updated versionn ->",
            prevFieldUpdated
          );

          const currentFieldUpdated = await prisma.CRMField.update({
            where: {
              id: crmFieldFound.id,
            },
            data: {
              position: prevField.position,
            },
          });

          console.log(
            "current field ka updated versionn ->",
            currentFieldUpdated
          );

          // Retrieve all CRM fields for the campaign after position update
          const allCampaignFields = await prisma.campaign
            .findFirst({
              where: { id: parseInt(campaignId) },
            })
            .crmFields()
            .then((fields) => fields.sort((a, b) => a.position - b.position));

          res.json({
            message: "CRM field updated successfully!",
            data: allCampaignFields,
            status: "positions-updated",
          });
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

        res.json({
          message: "CRM field updated successfully!",
          data: allCampaignFields,
          status: "success",
        });
      }
    } catch (error) {
      console.log("Error while updating CRM field: ", error);
      res
        .status(500)
        .json({ message: "Internal server error", status: "error" });
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

        res.status(201).json({
          message: "crmField deleted successfully!",
          data: allCampaignFields,
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
