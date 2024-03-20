const express = require("express");
const userAuthRouter = express.Router();
const userController = require("../controllers/userController");

userAuthRouter.post("/:adminId/login", userController.userLogin);
userAuthRouter.post("/:adminId/register", userController.userRegister);

module.exports = userAuthRouter;
