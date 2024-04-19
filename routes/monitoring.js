const express = require("express");
const MonitoringRouter = express.Router({ mergeParams: true });
const MonitoringController = require("../controllers/monitoringController");

MonitoringRouter.get("/monitoring", MonitoringController.monitoringGet);
MonitoringRouter.post("/monitoring", MonitoringController.monitoringData);

module.exports = MonitoringRouter;
