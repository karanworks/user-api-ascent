const express = require("express");
const roleRouter = express.Router();
const roleController = require("../controllers/roleController");

roleRouter.post("/:adminId/role/create", roleController.roleCreatePost);
roleRouter.patch("/:adminId/role/:roleId/edit", roleController.roleUpdatePatch);
roleRouter.delete(
  "/:adminId/role/:roleId/delete",
  roleController.roleRemoveDelete
);
roleRouter.get("/roles", roleController.roleGet);

module.exports = roleRouter;
