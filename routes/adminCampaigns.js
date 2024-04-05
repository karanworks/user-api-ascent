const express = require("express");
const adminCampaignsRouter = express.Router();
const adminCampaignsController = require("../controllers/adminCampaignsController");

adminCampaignsRouter.get(
  "/campaigns",
  adminCampaignsController.adminCampaignsGet
);

module.exports = adminCampaignsRouter;
