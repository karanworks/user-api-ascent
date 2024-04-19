const express = require("express");
const mappingRouter = express.Router({ mergeParams: true });
const mappingController = require("../controllers/mappingController");

mappingRouter.get("/mapping", mappingController.getMapping);

mappingRouter.post(
  "/role/:roleId/mapping",
  mappingController.changePermissionsPost
);

mappingRouter.get(
  "/role/:roleId/mapping",
  mappingController.allowedPermissionsGet
);

module.exports = mappingRouter;
