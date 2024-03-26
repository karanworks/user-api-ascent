const express = require("express");
const CRMFieldsRouter = express.Router({ mergeParams: true });
const CRMFieldsController = require("../controllers/crmFieldsController");

CRMFieldsRouter.post(
  "/:adminId/campaign/:campaignId/crm-field/create",
  CRMFieldsController.crmFieldsCreatePost
);
CRMFieldsRouter.patch(
  "/:adminId/campaign/:campaignId/crm-field/:crmFieldId/edit",
  CRMFieldsController.crmFieldsUpdatePatch
);
CRMFieldsRouter.delete(
  "/:adminId/campaign/:campaignId/crm-field/:crmFieldId/delete",
  CRMFieldsController.crmFieldsRemoveDelete
);

module.exports = CRMFieldsRouter;
