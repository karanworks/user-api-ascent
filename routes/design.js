const express = require("express");
const DesignRouter = express.Router({ mergeParams: true });
const DesignController = require("../controllers/designController");

DesignRouter.get("/ivr-design", DesignController.getDesign);

module.exports = DesignRouter;
