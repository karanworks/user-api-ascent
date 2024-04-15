const getLoggedInUser = require("../utils/getLoggedInUser");
const getToken = require("../utils/getToken");
const response = require("../utils/response");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DispositionController {
  async createDispositionPost(req, res) {
    try {
      const { dispositionName, options, campaignId } = req.body;

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

        response.success(res, "Disposition created!", newDisposition);
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating disposition ->", error);
    }
  }

  async updateDispositionPatch(req, res) {
    try {
      const { dispositionName, options } = req.body;
      const { campaignId, dispositionId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const alreadyExistedDisposition = await prisma.disposition.findFirst({
        where: {
          id: parseInt(dispositionId),
          campaignId: parseInt(campaignId),
        },
      });

      if (loggedInUser) {
        if (alreadyExistedDisposition) {
          if (alreadyExistedDisposition.dispositionName === dispositionName) {
            const updatedDisposition = await prisma.disposition.update({
              where: {
                id: parseInt(dispositionId),
              },
              data: {
                dispositionName,
                options: JSON.stringify(options),
              },
            });

            response.success(res, "Disposition updated!", updatedDisposition);
          } else {
            response.error(res, "Disposition with same name already exists.");
          }
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating disposition ->", error);
    }
  }
  async removeDispositionDelete(req, res) {
    try {
      const { dispositionId, campaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const ifExists = await prisma.disposition.findFirst({
        where: {
          id: parseInt(dispositionId),
          campaignId: parseInt(campaignId),
        },
      });

      if (loggedInUser) {
        if (ifExists) {
          const deletedDisposition = await prisma.disposition.delete({
            where: {
              id: ifExists.id,
              campaignId: parseInt(campaignId),
            },
          });

          response.success(res, "Disposition deleted!", deletedDisposition);
        } else {
          response.error(res, "Disposition not found!");
        }
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
