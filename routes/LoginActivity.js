const express = require("express");
const LoginActivityRouter = express.Router({ mergeParams: true });
const LoginActivityController = require("../controllers/loginActivityController");

LoginActivityRouter.get(
  "/login-activity",
  LoginActivityController.loginActivityGet
);
LoginActivityRouter.post(
  "/login-activity",
  LoginActivityController.loginActivityDataPost
);

module.exports = LoginActivityRouter;
