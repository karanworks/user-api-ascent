const express = require("express");
const mappingRouter = express.Router({ mergeParams: true });
const mappingController = require("../controllers/mappingController");
const getMenus = require("../utils/getMenus");

mappingRouter.get("/mapping", async (req, res) => {
  try {
    const menus = await getMenus(req, res);

    res.json({
      message: "mappnig data fetched successfully",
      data: menus,
      status: "success",
    });
  } catch (error) {
    console.log("error in get mapping");
  }
});

mappingRouter.post(
  "/role/:roleId/mapping",
  mappingController.changePermissionsPost
);

mappingRouter.get(
  "/role/:roleId/mapping",
  mappingController.allowedPermissionsGet
);

module.exports = mappingRouter;
