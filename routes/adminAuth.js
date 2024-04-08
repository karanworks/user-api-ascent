const express = require("express");
const adminAuthRouter = express.Router({ mergeParams: true });
const adminController = require("../controllers/adminController");

adminAuthRouter.post("/login", adminController.userLoginPost);
adminAuthRouter.get("/login", adminController.userLoginGet);
adminAuthRouter.post("/register", adminController.userRegisterPost);
adminAuthRouter.post("/user/register", adminController.userRegisterPost);
adminAuthRouter.patch("/user/:userId/edit", adminController.userUpdatePatch);
adminAuthRouter.delete(
  "/user/:userId/delete",
  adminController.userRemoveDelete
);
adminAuthRouter.get("/logout", adminController.adminLogoutGet);

module.exports = adminAuthRouter;
