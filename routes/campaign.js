const express = require("express");
const campaignRouter = express.Router({ mergeParams: true });
const CampaignController = require("../controllers/campaignController");

campaignRouter.post(
  "/:adminId/campaign/create",
  CampaignController.campaignCreatePost
);
campaignRouter.patch(
  "/:adminId/campaign/:campaignId/edit",
  CampaignController.campaignUpdatePatch
);
campaignRouter.delete(
  "/:adminId/campaign/:campaignId/delete",
  CampaignController.campaignRemoveDelete
);

module.exports = campaignRouter;
