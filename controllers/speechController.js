const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getLoggedInUser = require("../utils/getLoggedInUser");
const response = require("../utils/response");
const session = require("../utils/session");
const getToken = require("../utils/getToken");
const path = require("path");
const fs = require("fs");

class SpeechController {
  async getSpeeches(req, res) {
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
                  speeches: true,
                },
              },
            },
          });

          const { password, ...adminDataWithoutPassword } = loggedInUser;

          // update the session
          session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "Speeches fetched", adminDataWithoutPassword);
        } else {
          response.error(res, "User not active");
        }
      } else {
        response.error(res, "user not logged in.");
      }
    } catch (error) {
      console.log("error while getting speeches data", error);
    }
  }

  async createSpeechPost(req, res) {
    try {
      const {
        title,
        speechText,
        speechAudioName,
        ivrCampaignId,
        fileNameWithTime,
      } = req.body;

      const loggedInUser = await getLoggedInUser(req, res);

      const alreadyExisted = await prisma.speech.findFirst({
        where: {
          OR: [{ title }],
        },
      });

      if (loggedInUser) {
        if (alreadyExisted) {
          if (alreadyExisted.title === title) {
            response.error(
              res,
              "Speech already exist with same title.",
              alreadyExisted
            );
          }
        } else {
          const newSpeech = await prisma.speech.create({
            data: {
              title,
              speechText,
              url:
                speechAudioName &&
                `${process.env.SERVER_URL}/audio/${fileNameWithTime}`,
              speechAudio: speechAudioName,
              ivrCampaignId: parseInt(ivrCampaignId),
              createdBy: loggedInUser.id,
            },
          });

          response.success(res, "Speech created!", newSpeech);
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating speech ->", error);
    }
  }

  async updateSpeechPatch(req, res) {
    try {
      const { title, speechText, speechAudioName } = req.body;
      const { speechId, ivrCampaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const updatingSpeech = await prisma.speech.findFirst({
        where: {
          id: parseInt(speechId),
          ivrCampaignId: parseInt(ivrCampaignId),
        },
      });

      const alreadyExisted = await prisma.speech.findFirst({
        where: {
          OR: [{ title }],
          NOT: {
            id: updatingSpeech.id,
          },
        },
      });

      console.log("already existed speech while updating ->", alreadyExisted);

      if (loggedInUser) {
        if (alreadyExisted) {
          if (alreadyExisted.title === title) {
            response.error(
              res,
              "Speech with same title already exists.",
              alreadyExisted
            );
          }
        } else {
          console.log("else condition called while updating");
          const updatedSpeech = await prisma.speech.update({
            where: {
              id: parseInt(speechId),
            },
            data: {
              title,
              speechText,
              speechAudio: speechAudioName,
            },
          });

          response.success(res, "Speech updated!", updatedSpeech);
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while creating speech ->", error);
    }
  }

  async removeSpeechDelete(req, res) {
    try {
      const { speechId, ivrCampaignId } = req.params;

      const loggedInUser = await getLoggedInUser(req, res);

      const ifExists = await prisma.speech.findFirst({
        where: {
          id: parseInt(speechId),
          ivrCampaignId: parseInt(ivrCampaignId),
        },
      });

      if (loggedInUser) {
        if (ifExists) {
          const deletedSpeech = await prisma.speech.delete({
            where: {
              id: ifExists.id,
              ivrCampaignId: parseInt(ivrCampaignId),
            },
          });

          response.success(res, "Speech deleted!", deletedSpeech);
        } else {
          response.error(res, "Speech not found!");
        }
      } else {
        response.error(res, "No logged in user!");
      }
    } catch (error) {
      console.log("error while deleting speech ->", error);
    }
  }
}

module.exports = new SpeechController();
