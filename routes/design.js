const express = require("express");
const DesignRouter = express.Router({ mergeParams: true });
const DesignController = require("../controllers/designController");

DesignRouter.get("/ivr-design", DesignController.getDesign);
DesignRouter.post("/ivr-design/create", DesignController.createDesignPost);
DesignRouter.delete(
  "/ivr-design/:designId/delete",
  DesignController.designRemoveDelete
);

module.exports = DesignRouter;
