const express = require("express");
const crmRouter = express.Router({ mergeParams: true });
const CRMController = require("../controllers/crmController");

crmRouter.post("/crm/create", CRMController.createCRMFormDataPost);

module.exports = crmRouter;
