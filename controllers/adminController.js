const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AdminController {
  async userRegisterPost(req, res) {
    try {
      const { name, email, password, roleId, agentMobile } = req.body;
      const userIp = req.socket.remoteAddress;
      const token = req.cookies.token;

      const adminUser = await prisma.user.findFirst({
        where: {
          token: parseInt(token),
        },
      });

      const alreadyRegistered = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { agentMobile }],
        },
      });

      if (adminUser) {
        if (alreadyRegistered) {
          if (alreadyRegistered.email === email) {
            res.json({
              message: "User already registered with this CRM Email.",
              data: alreadyRegistered,
              status: "failure",
            });
          } else if (alreadyRegistered.agentMobile === agentMobile) {
            res.json({
              message: "User already registered with this Mobile no.",
              data: alreadyRegistered,
              status: "failure",
            });
          }
        } else {
          const newUser = await prisma.user.create({
            data: {
              username: name,
              email,
              password,
              userIp,
              roleId: parseInt(roleId),
              adminId: adminUser.id,
              agentMobile,
            },
          });
          res.status(201).json({
            message: "user registered successfully!",
            data: newUser,
            status: "success",
          });
        }
      } else {
        const newUser = await prisma.user.create({
          data: { username, email, password, userIp, roleId: 1, agentMobile },
        });
        res.status(201).json({
          message: "user registered successfully!",
          data: newUser,
          status: "success",
        });
      }
    } catch (error) {
      console.log("error while registration superadmin ->", error);
    }
  }

  async userLoginPost(req, res) {
    try {
      const { email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      let userFound = await prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!userFound) {
        res.status(400).json({
          message: "no user found with this email",
          status: "failure",
        });
      } else if (password === userFound.password) {
        // generates a number between 1000 and 10000 to be used as token
        const loginToken = Math.floor(
          Math.random() * (10000 - 1000 + 1) + 1000
        );

        // updating user's token, and isActive status
        const updatedAdmin = await prisma.user.update({
          where: {
            id: userFound.id,
            email,
          },
          data: {
            isActive: 1,
            token: loginToken,
            userIp,
          },

          include: {
            campaigns: {
              select: {
                id: true,
                campaignName: true,
                campaignDescription: true,
                campaignType: true,
                callback: true,
                dnc: true,
                amd: true,
                crmFields: true,
              },
            },
          },
        });

        const allUsers = await prisma.user.findMany({
          where: {
            adminId: userFound.id,
          },
          select: {
            id: true,
            username: true,
            password: true,
            email: true,
            agentMobile: true,
            roleId: true,
          },
        });

        const role = await prisma.role.findFirst({
          where: {
            id: updatedAdmin.roleId,
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
          const matchingSubMenus = subMenu.filter(
            (sub) => sub.menuId === menu.id
          );
          // Push matching submenus into the subMenus array of the menu
          menu.subItems.push(...matchingSubMenus);
        });

        const { password, ...adminDataWithoutPassword } = updatedAdmin;

        // cookie expiration date - 15 days
        const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        res.cookie("token", loginToken, {
          expires: expirationDate,
          httpOnly: true,
          secure: true,
        });

        res.status(200).json({
          message: "user logged in!",
          data: {
            ...adminDataWithoutPassword,
            users: allUsers,
            menus: menusWithSubMenuProperty,
          },
          status: "success",
        });
      } else {
        res.status(400).json({ message: "Wrong password!", status: "failure" });
      }
    } catch (error) {
      console.log("error while loggin in user ", error);
    }
  }

  async userUpdatePatch(req, res) {
    try {
      const { name, email, password, agentMobile, roleId } = req.body;

      const { userId } = req.params;

      // finding user from id
      const userFound = await prisma.user.findFirst({
        where: {
          id: parseInt(userId),
        },
      });

      let alreadyRegistered;

      if (userFound.email === email && userFound.agentMobile !== agentMobile) {
        alreadyRegistered = await prisma.user.findFirst({
          where: {
            agentMobile,
          },
        });
      }

      if (userFound.email !== email && userFound.agentMobile === agentMobile) {
        alreadyRegistered = await prisma.user.findFirst({
          where: {
            email,
          },
        });
      }

      if (userFound) {
        if (alreadyRegistered) {
          if (alreadyRegistered.email === email) {
            res.json({
              message: "User already registered with this CRM Email.",
              data: alreadyRegistered,
              status: "failure",
            });
          } else if (alreadyRegistered.agentMobile === agentMobile) {
            res.json({
              message: "User already registered with this Mobile no.",
              data: alreadyRegistered,
              status: "failure",
            });
          }
        } else {
          const updatedUser = await prisma.user.update({
            where: {
              email,
            },
            data: {
              username: name,
              email,
              password,
              agentMobile,
              roleId: parseInt(roleId),
            },
          });
          res.json({
            message: "user updated successfully!",
            data: { updatedUser },
          });
        }
      } else {
        res.json({ message: "user not found!" });
      }
    } catch (error) {
      console.log("error while updating user in admin controller", error);
    }
  }

  async userRemoveDelete(req, res) {
    try {
      const { userId } = req.params;

      // finding user from userId
      const userFound = await prisma.user.findFirst({
        where: {
          id: parseInt(userId),
        },
      });

      if (userFound) {
        const deletedUser = await prisma.user.delete({
          where: {
            id: parseInt(userId),
          },
        });

        res.status(201).json({
          message: "user deleted successfully!",
          data: { deletedUser },
        });
      } else {
        res.status(404).json({ message: "user does not exist!" });
      }
    } catch (error) {
      console.log("error while deleting user ", error);
    }
  }

  async userLoginGet(req, res) {
    try {
      const token = req.cookies.token;

      if (token) {
        const loggedInUser = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
          select: {
            id: true,
            email: true,
            password: true,
            campaigns: {
              select: {
                id: true,
                campaignName: true,
                campaignDescription: true,
                campaignType: true,
                callback: true,
                dnc: true,
                amd: true,
                crmFields: true,
              },
            },
          },
        });

        const users = await prisma.user.findMany({
          where: {
            adminId: loggedInUser.id,
          },
          select: {
            id: true,
            username: true,
            password: true,
            email: true,
            agentMobile: true,
            roleId: true,
          },
        });

        const role = await prisma.role.findFirst({
          where: {
            id: loggedInUser.roleId,
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
          const matchingSubMenus = subMenu.filter(
            (sub) => sub.menuId === menu.id
          );
          // Push matching submenus into the subMenus array of the menu
          menu.subItems.push(...matchingSubMenus);
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        res.status(200).json({
          message: "user logged in with token!",
          data: {
            ...adminDataWithoutPassword,
            users,
            menus: menusWithSubMenuProperty,
          },
          status: "success",
        });
      } else {
        res
          .status(401)
          .json({ message: "user not already logged in.", status: "failure" });
      }
    } catch (error) {
      console.log("error while loggin in user, get method ", error);
    }
  }
  async adminLogoutGet(req, res) {
    try {
      res.clearCookie("token");
      res.send({ message: "user logged out successflly!" });
    } catch (error) {
      console.log("error while loggin in user ", error);
    }
  }
}

module.exports = new AdminController();
