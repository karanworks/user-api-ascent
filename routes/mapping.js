const express = require("express");
const mapping = express.Router({ mergeParams: true });
const mappingController = require("../controllers/mappingController");
const getMenus = require("../utils/getMenus");

mapping.get("/mapping", async (req, res) => {
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

mapping.post("/role/:roleId/mapping", mappingController.changePermissionsPost);

mapping.get("/role/:roleId/mapping", mappingController.allowedPermissionsGet);

module.exports = mapping;
