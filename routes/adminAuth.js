const express = require("express");
const adminAuthRouter = express.Router();
const adminController = require("../controllers/adminController");

adminAuthRouter.post("/login", adminController.adminLoginPost);
adminAuthRouter.get("/login", adminController.adminLoginGet);
adminAuthRouter.post("/register", adminController.adminRegisterPost);
adminAuthRouter.get("/logout", adminController.adminLogoutGet);

module.exports = adminAuthRouter;
