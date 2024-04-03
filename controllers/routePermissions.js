const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class RoutePermissions {
  async changePermissionsPost(req, res) {
    try {
      const { menuId, subMenuId, roleId } = req.body;

      const permissionAlreadyExists = await prisma.subMenuAssign.findFirst({
        where: {
          roleId: parseInt(roleId),
          menuId,
          subMenuId,
        },
      });

      if (permissionAlreadyExists) {
        const deletedPermission = await prisma.subMenuAssign.delete({
          where: {
            id: parseInt(permissionAlreadyExists.id),
            menuId,
            subMenuId,
            roleId: parseInt(roleId),
          },
        });

        res.json({
          message: "route persmissions revoked successfully",
          status: "success",
        });
      } else {
        const udpatePermissions = await prisma.subMenuAssign.create({
          data: {
            menuId,
            subMenuId,
            roleId: parseInt(roleId),
            status: 1,
          },
        });
        res.json({
          message: "route persmissions given successfully",
          status: "success",
        });
      }
    } catch (error) {
      console.log("error while changing route permissions", error);
    }
  }
  async allowedPermissionsGet(req, res) {
    try {
      const { roleId } = req.params;

      console.log("allowed permissions api called");

      const role = await prisma.role.findFirst({
        where: {
          id: parseInt(roleId),
        },
      });

      console.log("current role ->", role);
      const subMenusAssign = await prisma.subMenuAssign.findMany({
        where: {
          roleId: role.id,
        },
      });

      const submenuIds = subMenusAssign.map((item) => item.subMenuId);

      const subMenu = await prisma.subMenu.findMany({
        where: {
          id: {
            in: submenuIds,
          },
        },
      });

      const uniqueSubMenuid = new Set(subMenu.map((item) => item.menuId));

      const menus = await prisma.menu.findMany({
        where: {
          id: {
            in: [...uniqueSubMenuid],
          },
        },
      });

      const menusWithSubMenuProperty = menus.map((menu) => {
        return { ...menu, subItems: [] };
      });

      menusWithSubMenuProperty.forEach((menu) => {
        // Filter submenus that have matching menuId
        const matchingSubMenus = subMenu.filter(
          (sub) => sub.menuId === menu.id
        );
        // Push matching submenus into the subMenus array of the menu
        menu.subItems.push(...matchingSubMenus);
      });

      res.json({
        message: "route persmissions fetched successfully",
        data: menusWithSubMenuProperty,
        status: "success",
      });
    } catch (error) {
      console.log("error while changing getting permissions", error);
    }
  }
}

module.exports = new RoutePermissions();
