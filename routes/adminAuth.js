const express = require("express");
const adminAuthRouter = express.Router({ mergeParams: true });
const adminController = require("../controllers/adminController");

adminAuthRouter.post("/login", adminController.adminLoginPost);
adminAuthRouter.get("/login", adminController.adminLoginGet);
adminAuthRouter.post("/register", adminController.superadminRegisterPost);
adminAuthRouter.post(
  "/:adminId/user/register",
  adminController.userRegisterPost
);
adminAuthRouter.get("/logout", adminController.adminLogoutGet);

module.exports = adminAuthRouter;
