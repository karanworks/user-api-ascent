const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getLoggedInUser = require("../utils/getLoggedInUser");
const response = require("../utils/response");

class CRMController {
  async getCRMData(req, res) {
    try {
      const token = await getToken(req, res);

      if (token) {
        const { isActive } = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
        });

        if (isActive) {
          // DO SOMETHING IN FUTURE
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "User not logged in");
      }
    } catch (error) {
      console.log("error in get crm data controller", error);
    }
  }

  async createCRMFormDataPost(req, res) {
    try {
      const { body } = req;

      const loggedInUser = await getLoggedInUser(req, res);

      const formData = {};

      const formDataValues = Object.keys(body).filter(
        (key) =>
          key !== "campaignId" &&
          key !== "disposition" &&
          key !== "subdisposition"
      );

      for (let i = 0; i < formDataValues.length; i++) {
        formData[`col_${i + 1}`] = body[formDataValues[i]];
      }

      console.log("crm form data body ->", body);
      // console.log("form data values after modification ->", {
      //   addedBy: loggedInUser.id,
      //   status: 1,
      //   campaignId: body.campaignId,
      //   ...formData,
      // });

      await prisma.CRMFormData.create({
        data: {
          addedBy: loggedInUser.id,
          status: 1,
          campaignId: body.campaignId,
          disposition: body.disposition,
          subDisposition: body.subDisposition,
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
