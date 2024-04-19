const { PrismaClient } = require("@prisma/client");
const response = require("../utils/response");
const getToken = require("../utils/getToken");
const prisma = new PrismaClient();

class AdminCrmFieldsController {
  async adminCrmFieldsGet(req, res) {
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
              campaigns: {
                select: {
                  id: true,
                  campaignName: true,
                  campaignDescription: true,
                  campaignType: true,
                  callback: true,
                  dnc: true,
                  amd: true,
                  crmFields: true,
                },
              },
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          response.success(res, "campaigns with crm fields fetched fetched!", {
            ...adminDataWithoutPassword,
          });
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "admin not already logged in.");
      }
    } catch (error) {
      console.log("error while getting crm configuration data", error);
    }
  }
}

module.exports = new AdminCrmFieldsController();
