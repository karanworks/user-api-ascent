const express = require("express");
const adminAuthRouter = express.Router();
const adminController = require("../controllers/adminController");

adminAuthRouter.post("/login", adminController.adminLogin);
adminAuthRouter.post("/register", adminController.adminRegister);

module.exports = adminAuthRouter;
