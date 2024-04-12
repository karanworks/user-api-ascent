const getLoggedInUser = require("../utils/getLoggedInUser");
const getToken = require("../utils/getToken");
const response = require("../utils/response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DispositionController {
  async createDispositionPost(req, res) {
    try {
      const { dispositionName, options, campaignId } = req.body;
      console.log(
        "Disposition Name->",
        dispositionName,
        "Disposition options ->",
        options,
        "Campaign Id ->",
        campaignId
      );
      const loggedInUser = await getLoggedInUser(req, res);

      if (loggedInUser) {
        const newDisposition = await prisma.disposition.create({
          data: {
            dispositionName,
            options: JSON.stringify(options),
            campaignId,
            createdBy: loggedInUser.id,
          },
        });

        console.log("newly created disposition ->", newDisposition);
        response.success(res, "Disposition created!".newDisposition);
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating disposition ->", error);
    }
  }
  async getDispositions(req, res) {
    try {
      const token = await getToken(req, res);

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
                dispositions: true,
              },
            },
          },
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        console.log("disposition data ->", adminDataWithoutPassword);

        response.success(res, "Dispositions fetched", {
          ...adminDataWithoutPassword,
        });
      } else {
        response.error(res, "user not logged in.");
      }
    } catch (error) {
      console.log("error while getting dispositions data", error);
    }
  }
}

module.exports = new DispositionController();
