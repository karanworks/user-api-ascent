const express = require("express");
const roleRouter = express.Router();
const roleController = require("../controllers/roleController");

roleRouter.post("/role/create", roleController.roleCreatePost);
roleRouter.patch("/role/:roleId/edit", roleController.roleUpdatePatch);
roleRouter.delete("/role/:roleId/delete", roleController.roleRemoveDelete);
roleRouter.get("/roles", roleController.roleGet);

module.exports = roleRouter;
