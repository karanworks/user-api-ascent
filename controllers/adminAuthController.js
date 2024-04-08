const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const response = require("../utils/response");
const getLoggedInUser = require("../utils/getLoggedInUser");
const getMenus = require("../utils/getMenus");

class AdminAuthController {
  async userRegisterPost(req, res) {
    try {
      const { name, email, password, roleId, agentMobile } = req.body;
      const userIp = req.socket.remoteAddress;

      const loggedInUser = await getLoggedInUser(req, res);

      const alreadyRegistered = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { agentMobile }],
        },
      });

      if (loggedInUser) {
        if (alreadyRegistered) {
          if (alreadyRegistered.email === email) {
            response.error(
              res,
              "User already registered with this CRM Email.",
              alreadyRegistered
            );
          } else if (alreadyRegistered.agentMobile === agentMobile) {
            response.error(
              res,
              "User already registered with this Mobile no.",
              alreadyRegistered
            );
          }
        } else {
          const newUser = await prisma.user.create({
            data: {
              username: name,
              email,
              password,
              userIp,
              roleId: parseInt(roleId),
              adminId: loggedInUser.id,
              agentMobile,
            },
          });

          response.success(res, "User registered successfully!", newUser);
        }
      } else {
        const newUser = await prisma.user.create({
          data: { username, email, password, userIp, roleId: 1, agentMobile },
        });

        response.success(res, "User registered successfully!", newUser);
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
        response.error(res, "No user found with this email!");
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

        const menus = await getMenus(req, res, updatedAdmin);

        const { password, ...adminDataWithoutPassword } = updatedAdmin;

        // cookie expiration date - 15 days
        const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        res.cookie("token", loginToken, {
          expires: expirationDate,
          httpOnly: true,
          secure: true,
        });

        response.success(res, "User logged in!", {
          ...adminDataWithoutPassword,
          users: allUsers,
          menus,
        });
      } else {
        // res.status(400).json({ message: "Wrong password!", status: "failure" });
        response.error(res, "Wrong password!");
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
            response.error(
              res,
              "User already registered with this CRM Email.",
              alreadyRegistered
            );
          } else if (alreadyRegistered.agentMobile === agentMobile) {
            response.error(
              res,
              "User already registered with this Mobile no.",
              alreadyRegistered
            );
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

          response.success(res, "User updated successfully!", { updatedUser });
        }
      } else {
        // res.json({ message: "user not found!" });
        response.error(res, "User not found!");
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

        response.success(res, "User deleted successfully!", { deletedUser });
      } else {
        response.error(res, "User does not exist! ");
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

        const menus = await getMenus(req, res, updatedAdmin);

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        response.success(res, "User logged in with token!", {
          ...adminDataWithoutPassword,
          users,
          menus,
        });
      } else {
        // for some reason if we remove status code from response logout thunk in frontend gets triggered multiple times
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
      response.success(res, "User logged out successflly!");
    } catch (error) {
      console.log("error while loggin in user ", error);
    }
  }
}

module.exports = new AdminAuthController();
