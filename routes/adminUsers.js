const express = require("express");
const adminUsersRouter = express.Router();
const adminUsersController = require("../controllers/adminUsersController");

adminUsersRouter.get("/:userId/users", adminUsersController.adminUsersGet);

module.exports = adminUsersRouter;
