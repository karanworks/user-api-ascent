const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminCrmFieldsController {
  async adminCrmFieldsGet(req, res) {
    try {
      const token = req.cookies.token;

      if (token) {
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

        res.status(200).json({
          message: "campaigns with crm fields fetched fetched!",
          data: { ...adminDataWithoutPassword },
          status: "success",
        });
      } else {
        res.status(401).json({ message: "admin not already logged in." });
      }
    } catch (error) {
      console.log("error while getting crm configuration data", error);
    }
  }
}

module.exports = new AdminCrmFieldsController();
