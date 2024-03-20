const express = require("express");
const userAuthRouter = express.Router();
const userController = require("../controllers/userController");

userAuthRouter.post("/:adminId/login", userController.userLoginPost);
userAuthRouter.post("/:adminId/register", userController.userRegisterPost);

module.exports = userAuthRouter;
