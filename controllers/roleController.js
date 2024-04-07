const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class RoleController {
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

  async roleCreatePost(req, res) {
    try {
      const { name, status } = req.body;

      const token = req.cookies.token;

      // admin that is creating the campaign
      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const adminFound = await prisma.user.findFirst({
        where: {
          id: adminUser.id,
        },
      });

      if (adminFound) {
        const role = await prisma.role.create({ data: { name, status: 1 } });
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

  async roleUpdatePatch(req, res) {
    try {
      const { name } = req.body;
      const { roleId } = req.params;

      const token = req.cookies.token;

      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const adminFound = await prisma.user.findFirst({
        where: {
          id: adminUser.id,
        },
      });

      if (adminFound) {
        const roleToBeEdit = await prisma.role.findFirst({
          where: {
            id: parseInt(roleId),
          },
        });

        if (roleToBeEdit) {
          const updatedRole = await prisma.role.update({
            where: {
              id: roleToBeEdit.id,
            },
            data: {
              name,
            },
          });

          res.json({
            message: "role updated successfully",
            data: updatedRole,
            status: "success",
          });
        }
      } else {
        res.json({ message: "admin not found", status: "failure" });
      }
    } catch (error) {
      console.log("error while updating role name ->", error);
    }
  }

  async roleRemoveDelete(req, res) {
    try {
      const { roleId } = req.params;

      const token = req.cookies.token;

      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const adminFound = await prisma.user.findFirst({
        where: {
          id: adminUser.id,
        },
      });

      if (adminFound) {
        const deletedRole = await prisma.role.delete({
          where: {
            id: parseInt(roleId),
          },
        });

        res.json({
          message: "Role deleted succssfully",
          data: deletedRole,
          status: "success",
        });
      } else {
        res.json({
          message: "admin not found",
          status: "success",
        });
      }
    } catch (error) {
      console.log("error while deleting role ->", error);
    }
  }
}

module.exports = new RoleController();
