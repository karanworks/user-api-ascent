const express = require("express");
const SpeechRouter = express.Router({ mergeParams: true });
const SpeechController = require("../controllers/speechController");

SpeechRouter.get("/speech", SpeechController.getSpeeches);
SpeechRouter.post("/speech/create", SpeechController.createSpeechPost);
SpeechRouter.patch(
  "/ivr-campaign/:ivrCampaignId/speech/:speechId/edit",
  SpeechController.updateSpeechPatch
);
SpeechRouter.delete(
  "/ivr-campaign/:ivrCampaignId/speech/:speechId/delete",
  SpeechController.removeSpeechDelete
);

module.exports = SpeechRouter;
