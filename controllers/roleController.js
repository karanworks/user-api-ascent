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
      const { adminId, roleId } = req.params;

      console.log("api to update role called");

      const adminFound = await prisma.user.findFirst({
        where: {
          id: parseInt(adminId),
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
      const { adminId, roleId } = req.params;

      const adminFound = await prisma.user.findFirst({
        where: {
          id: parseInt(adminId),
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
