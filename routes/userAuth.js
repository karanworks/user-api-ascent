const express = require("express");
const userAuthRouter = express.Router({ mergeParams: true });
const userController = require("../controllers/userController");

userAuthRouter.post("/user/login", userController.userLoginPost);
// userAuthRouter.post("/:adminId/user/register", userController.userRegisterPost);
// userAuthRouter.patch(
//   "/:adminId/user/:userId/edit",
//   userController.userUpdatePatch
// );
// userAuthRouter.delete(
//   "/:adminId/user/:userId/delete",
//   userController.userRemoveDelete
// );

module.exports = userAuthRouter;
