const express = require("express");
const dispositionRouter = express.Router({ mergeParams: true });
const DispositionController = require("../controllers/dispositionController");

dispositionRouter.get("/dispositions", DispositionController.getDispositions);
dispositionRouter.post(
  "/disposition/create",
  DispositionController.createDispositionPost
);

module.exports = dispositionRouter;
