const express = require("express");
const adminCampaignsRouter = express.Router();
const adminCampaignsController = require("../controllers/adminCampaignsController");

adminCampaignsRouter.get("/", adminCampaignsController.adminCampaignsGet);

module.exports = adminCampaignsRouter;
