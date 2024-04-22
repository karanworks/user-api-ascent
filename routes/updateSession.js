const express = require("express");
const updateSession = express.Router();
const updateSessionController = require("../controllers/updateSessionController");

updateSession.patch(
  "/update-session",
  updateSessionController.updateSessionPatch
);

module.exports = updateSession;
