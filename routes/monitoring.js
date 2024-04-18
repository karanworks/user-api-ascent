const express = require("express");
const MonitoringRouter = express.Router({ mergeParams: true });
const MonitoringController = require("../controllers/monitoringController");

MonitoringRouter.post("/monitoring", MonitoringController.monitoringData);

module.exports = MonitoringRouter;
