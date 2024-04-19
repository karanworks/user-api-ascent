const express = require("express");
const crmRouter = express.Router({ mergeParams: true });
const CRMController = require("../controllers/crmController");

crmRouter.get("/crm", CRMController.getCRMData);
crmRouter.post("/crm/create", CRMController.createCRMFormDataPost);

module.exports = crmRouter;
