const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getMenus(req, res) {
  const token = req.cookies.token;

  // admin that is creating the campaign
  const adminUser = await prisma.user.findFirst({
    where: {
      token: parseInt(token),
    },
  });

  const role = await prisma.role.findFirst({
    where: {
      id: adminUser.id,
    },
  });

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
    const matchingSubMenus = subMenu.filter((sub) => sub.menuId === menu.id);
    // Push matching submenus into the subMenus array of the menu
    menu.subItems.push(...matchingSubMenus);
  });

  return menusWithSubMenuProperty;
}

module.exports = getMenus;
