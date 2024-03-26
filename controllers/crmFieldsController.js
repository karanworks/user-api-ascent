const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class CRMFieldsController {
  async crmFieldsCreatePost(req, res) {
    try {
      const { caption, type, required, readOnly, position } = req.body;
      const { campaignId } = req.params;

      // admin that is creating the crmField
      const adminId = parseInt(req.params.adminId);

      const newCRMField = await prisma.CRMField.create({
        data: {
          caption,
          type,
          required,
          readOnly,
          position,
          campaignId: parseInt(campaignId),
        },
      });

      res.status(201).json({
        message: "new crm field created!",
        data: newCRMField,
        status: "success",
      });
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
            required,
            readOnly,
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
