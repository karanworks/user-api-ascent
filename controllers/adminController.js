const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AdminController {
  async superadminRegisterPost(req, res) {
    try {
      const { username, email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      await prisma.user.create({
        data: { username, email, password, userIp, roleId: 1 },
      });
      res.status(201).json({
        message: "user registered successfully!",
        status: "success",
      });
    } catch (error) {
      console.log("error while registration superadmin ->", error);
    }
  }
  async userRegisterPost(req, res) {
    try {
      const { id, username, email, password, roleId } = req.body;
      const userIp = req.socket.remoteAddress;
      const { adminId } = req.params;

      if (id) {
        await prisma.user.create({
          data: {
            username,
            email,
            password,
            userIp,
            roleId,
            adminId: parseInt(adminId),
          },
        });
        res.status(201).json({
          message: "user registered successfully!",
          status: "success",
        });
      } else {
        res.status(404).json({
          message: "user id is required!",
          status: "failure",
        });
      }
    } catch (error) {
      console.log("error while registration user ->", error);
    }
  }

  async adminLoginPost(req, res) {
    try {
      const { userId, email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      let userFound;

      if (userId) {
        // Finding user by ID
        userFound = await prisma.user.findUnique({
          where: {
            id: parseInt(userId),
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });
      } else if (email) {
        userFound = await prisma.user.findFirst({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });
      }

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
            email: true,
            agentMobile: true,
          },
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
          data: { ...adminDataWithoutPassword, users: allUsers },
          status: "success",
        });
      } else {
        res.status(400).json({ message: "Wrong password!", status: "failure" });
      }
    } catch (error) {
      console.log("error while loggin in user ", error);
    }
  }
  async adminLoginGet(req, res) {
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
            email: true,
            agentMobile: true,
          },
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        res.status(200).json({
          message: "user logged in with token!",
          data: { ...adminDataWithoutPassword, users },
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
