const express = require("express");
const roleRouter = express.Router();
const roleController = require("../controllers/roleController");

roleRouter.post("/:adminId/role/create", roleController.roleCreatePost);
roleRouter.get("/roles", roleController.roleGet);

module.exports = roleRouter;
