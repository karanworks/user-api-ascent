const express = require("express");
const adminAuthRouter = express.Router({ mergeParams: true });
const adminController = require("../controllers/adminController");

adminAuthRouter.post("/login", adminController.userLoginPost);
adminAuthRouter.get("/login", adminController.userLoginGet);
adminAuthRouter.post("/register", adminController.userRegisterPost);
adminAuthRouter.post(
  "/:adminId/user/register",
  adminController.userRegisterPost
);
adminAuthRouter.get("/logout", adminController.adminLogoutGet);

module.exports = adminAuthRouter;
