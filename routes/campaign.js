const express = require("express");
const campaignRouter = express.Router({ mergeParams: true });
const CampaignController = require("../controllers/campaignController");

campaignRouter.post("/campaign/create", CampaignController.campaignCreatePost);
campaignRouter.patch(
  "/campaign/:campaignId/edit",
  CampaignController.campaignUpdatePatch
);
campaignRouter.delete(
  "/campaign/:campaignId/delete",
  CampaignController.campaignRemoveDelete
);

module.exports = campaignRouter;
