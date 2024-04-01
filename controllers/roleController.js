const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class RoleController {
  async roleCreatePost(req, res) {
    try {
      const { name, status } = req.body;
      const { adminId } = req.params;

      console.log("admin id ->", adminId);

      const adminFound = await prisma.user.findFirst({
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
  }

  async roleGet(req, res) {
    try {
      const roles = await prisma.role.findMany({});
      res.json({
        message: "roles feteched successfully!",
        data: roles,
        status: "success",
      });
    } catch (error) {
      console.log("error while getting roles ->", error);
    }
  }
}

module.exports = new RoleController();
