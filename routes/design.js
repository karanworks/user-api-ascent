const express = require("express");
const DesignRouter = express.Router({ mergeParams: true });
const CampaignController = require("../controllers/campaignController");

DesignRouter.get("/ivr-design", CampaignController.campaignCreatePost);

module.exports = DesignRouter;
