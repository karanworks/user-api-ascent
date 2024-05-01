const express = require("express");
const IVRCampaignRouter = express.Router({ mergeParams: true });
const IVRCampaignController = require("../controllers/ivrCampaignController");

IVRCampaignRouter.get("/ivr-campaign", IVRCampaignController.ivrCampaignGet);

IVRCampaignRouter.post(
  "/ivr-campaign/create",
  IVRCampaignController.ivrCampaignCreatePost
);
IVRCampaignRouter.patch(
  "/ivr-campaign/:ivrCampaignId/edit",
  IVRCampaignController.ivrCampaignUpdatePatch
);
IVRCampaignRouter.delete(
  "/ivr-campaign/:ivrCampaignId/delete",
  IVRCampaignController.ivrCampaignRemoveDelete
);

module.exports = IVRCampaignRouter;
