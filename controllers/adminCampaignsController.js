const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminCampaignsController {
  async adminCampaignsGet(req, res) {
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
            campaigns: true,
          },
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        res.status(200).json({
          message: "campaigns fetched!",
          data: { ...adminDataWithoutPassword },
          status: "success",
        });
      } else {
        res.status(401).json({ message: "admin not already logged in." });
      }
    } catch (error) {
      console.log("error while getting admin campaigns", error);
    }
  }
}

module.exports = new AdminCampaignsController();
