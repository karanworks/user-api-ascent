const express = require("express");
const roleRouter = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

roleRouter.post("/:adminId/role/create", async (req, res) => {
  try {
    const { name, status } = req.body;
    const { adminId } = req.params;

    console.log("admin id ->", adminId);

    const adminFound = await prisma.admin.findFirst({
      where: {
        id: parseInt(adminId),
      },
    });

    console.log("admin found ->", adminFound);

    if (adminFound) {
      const role = await prisma.role.create({ data: { name, status } });
      res.json({
        message: "role created successfully",
        data: role,
        status: "success",
      });
    } else {
      res.json({ message: "no admin found", status: "failure" });
    }
  } catch (error) {
    console.log("error while creating role ->", error);
  }
});

module.exports = roleRouter;
