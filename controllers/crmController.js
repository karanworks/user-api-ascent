const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getLoggedInUser = require("../utils/getLoggedInUser");
const response = require("../utils/response");

class CRMController {
  async createCRMFormDataPost(req, res) {
    try {
      const { body } = req;

      const loggedInUser = await getLoggedInUser(req, res);

      const formData = {};

      const formDataValues = Object.keys(body).filter(
        (key) => key !== "campaignId"
      );

      for (let i = 0; i < formDataValues.length; i++) {
        formData[`col_${i + 1}`] = body[formDataValues[i]];
      }

      console.log("form data values after modification ->", {
        addedBy: loggedInUser.id,
        status: 1,
        campaignId: body.campaignId,
        ...formData,
      });

      await prisma.CRMFormData.create({
        data: {
          addedBy: loggedInUser.id,
          status: 1,
          campaignId: body.campaignId,
          ...formData,
        },
      });
      response.success(res, "Crm form data submitted successfully!");
    } catch (error) {
      console.log();
    }
  }
}

module.exports = new CRMController();
