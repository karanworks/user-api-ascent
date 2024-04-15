const express = require("express");
const dispositionRouter = express.Router({ mergeParams: true });
const DispositionController = require("../controllers/dispositionController");

dispositionRouter.get("/dispositions", DispositionController.getDispositions);
dispositionRouter.post(
  "/disposition/create",
  DispositionController.createDispositionPost
);
dispositionRouter.patch(
  "/campaign/:campaignId/disposition/:dispositionId/edit",
  DispositionController.updateDispositionPatch
);
dispositionRouter.delete(
  "/campaign/:campaignId/disposition/:dispositionId/delete",
  DispositionController.removeDispositionDelete
);

module.exports = dispositionRouter;
