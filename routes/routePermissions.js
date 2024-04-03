const express = require("express");
const routePermissionsRouter = express.Router({ mergeParams: true });
const routePermissionsController = require("../controllers/routePermissions");

// menuId, roleId, submenuId
routePermissionsRouter.post(
  "/:adminId/role/:roleId/permission",
  routePermissionsController.changePermissionsPost
);

routePermissionsRouter.get(
  "/:adminId/role/:roleId/permission",
  routePermissionsController.allowedPermissionsGet
);

module.exports = routePermissionsRouter;
