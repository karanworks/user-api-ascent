const express = require("express");
const NumberRouter = express.Router({ mergeParams: true });
const NumberController = require("../controllers/numberController");

NumberRouter.get("/number", NumberController.getNumbers);
NumberRouter.post("/number/create", NumberController.createNumberPost);
NumberRouter.patch(
  "/ivr-campaign/:ivrCampaignId/number/:numberId/edit",
  NumberController.updateNumberPatch
);
NumberRouter.delete(
  "/ivr-campaign/:ivrCampaignId/number/:numberId/delete",
  NumberController.removeNumberDelete
);

module.exports = NumberRouter;
