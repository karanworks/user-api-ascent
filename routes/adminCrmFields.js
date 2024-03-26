const express = require("express");
const adminCrmFieldsRouter = express.Router();
const adminCrmFieldsController = require("../controllers/adminCrmFieldsController");

adminCrmFieldsRouter.get(
  "/crm-configuration",
  adminCrmFieldsController.adminCrmFieldsGet
);

module.exports = adminCrmFieldsRouter;
