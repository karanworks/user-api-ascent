const express = require("express");
const adminUsersRouter = express.Router();
const adminUsersController = require("../controllers/adminUsersController");

adminUsersRouter.get("/users", adminUsersController.adminUsersGet);

module.exports = adminUsersRouter;
