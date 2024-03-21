const express = require("express");
const userAuthRouter = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");

userAuthRouter.post("/:adminId/login", userController.userLoginPost);
userAuthRouter.post("/:adminId/register", userController.userRegisterPost);
userAuthRouter.patch("/:adminId/:userId/edit", userController.userUpdatePatch);
userAuthRouter.delete(
  "/:adminId/:userId/delete",
  userController.userRemoveDelete
);

module.exports = userAuthRouter;
