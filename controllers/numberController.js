const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getLoggedInUser = require("../utils/getLoggedInUser");
const response = require("../utils/response");
const session = require("../utils/session");
const getToken = require("../utils/getToken");

class NumberController {
  async getNumbers(req, res) {
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
              adminId: true,
              ivrCampaigns: {
                select: {
                  id: true,
                  ivrCampaignName: true,
                  ivrCampaignDescription: true,
                  numbers: true,
                },
              },
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "Numbers fetched", {
            ...adminDataWithoutPassword,
          });
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "user not logged in.");
      }
    } catch (error) {
      console.log("error while getting numbers data", error);
    }
  }

  async createNumberPost(req, res) {
    try {
      const { name, number, department, ivrCampaignId } = req.body;

      const loggedInUser = await getLoggedInUser(req, res);

      const strNum = String(number);

      const alreadyExisted = await prisma.number.findFirst({
        where: {
          OR: [{ name }, { number: strNum }],
        },
      });

      if (loggedInUser) {
        if (alreadyExisted) {
          if (alreadyExisted.name === name) {
            response.error(
              res,
              "Number already exist with same name.",
              alreadyExisted
            );
          } else if (alreadyExisted.number === strNum) {
            response.error(
              res,
              "Number already exist with same number.",
              alreadyExisted
            );
          }
        } else {
          const newNumber = await prisma.number.create({
            data: {
              name,
              number: strNum,
              department,
              ivrCampaignId,
              createdBy: loggedInUser.id,
            },
          });

          response.success(res, "Number created!", newNumber);
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating number ->", error);
    }
  }

  async updateNumberPatch(req, res) {
    try {
      const { name, number, department } = req.body;
      const { numberId, ivrCampaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const strNum = String(number);

      const updatingNumber = await prisma.number.findFirst({
        where: {
          id: parseInt(numberId),
          ivrCampaignId: parseInt(ivrCampaignId),
        },
      });

      const alreadyExisted = await prisma.number.findFirst({
        where: {
          OR: [{ name }, { number: strNum }],
          NOT: {
            id: updatingNumber.id,
          },
        },
      });

      console.log("already existed number while updating ->", alreadyExisted);

      if (loggedInUser) {
        if (alreadyExisted) {
          if (alreadyExisted.name === name) {
            response.error(
              res,
              "Number with same name already exists.",
              alreadyExisted
            );
          } else if (alreadyExisted.number === strNum) {
            response.error(
              res,
              "Number with same number already exists.",
              alreadyExisted
            );
          }
        } else {
          console.log("else condition called while updating");
          const updatedNumber = await prisma.number.update({
            where: {
              id: parseInt(numberId),
            },
            data: {
              name,
              number: strNum,
              department,
            },
          });

          response.success(res, "Number updated!", updatedNumber);
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating number ->", error);
    }
  }

  async removeNumberDelete(req, res) {
    try {
      const { numberId, ivrCampaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const ifExists = await prisma.number.findFirst({
        where: {
          id: parseInt(numberId),
          ivrCampaignId: parseInt(ivrCampaignId),
        },
      });

      if (loggedInUser) {
        if (ifExists) {
          const deletedNumber = await prisma.number.delete({
            where: {
              id: ifExists.id,
              ivrCampaignId: parseInt(ivrCampaignId),
            },
          });

          response.success(res, "Number deleted!", deletedNumber);
        } else {
          response.error(res, "Number not found!");
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while deleting number ->", error);
    }
  }
}

module.exports = new NumberController();
