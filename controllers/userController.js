const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class UserController {
  async userRegisterPost(req, res, next) {
    try {
      const { userId, name, password, crmEmail, crmPassword, agentMobile } =
        req.body;

      // user ip
      const userIp = req.socket.remoteAddress;

      // admin that is creating the user
      const adminId = parseInt(req.params.adminId);
      // userId is string just converting it to integer
      const userIdInt = parseInt(userId);

      const alreadyRegistered = await prisma.user.findFirst({
        where: {
          OR: [{ id: userIdInt }, { crmEmail }, { agentMobile }],
        },
      });

      if (alreadyRegistered) {
        if (alreadyRegistered.id === userIdInt) {
          res.json({
            message: "User already registered with this user id.",
            data: alreadyRegistered,
            status: "failure",
          });
        } else if (alreadyRegistered.crmEmail === crmEmail) {
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
            id: userIdInt,
            username: name,
            password,
            crmEmail,
            crmPassword,
            agentMobile,
            userIp,
            adminId,
          },
        });
        

        res.status(201).json({
          message: "user registration successful",
          data: newUser,
        });
      }
    } catch (error) {
      console.log("error while registration user ->", error);
    }
  }

  async userLoginPost(req, res) {
    try {
      const { email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      // finding user from email
      const userFound = await prisma.admin.findFirst({
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
      } else if (password === adminFound.password) {
        // generates a number between 1000 and 10000 to be used as token
        const loginToken = Math.floor(
          Math.random() * (10000 - 1000 + 1) + 1000
        );

        // updating user's token, and isActive status
        const updatedUser = await prisma.user.update({
          where: {
            id: userFound.id,
            email,
          },
          data: {
            isActive: 1,
            token: loginToken,
            userIp,
          },
        });

        const { password, ...userDataWithoutPassword } = updatedUser;

        // cookie expiration date - 15 days
        const expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
        res.cookie("token", loginToken, { expires: expirationDate });

        res.status(200).json({
          message: "user logged in!",
          data: { ...userDataWithoutPassword },
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
      const { userId, name, password, crmEmail, crmPassword, agentMobile } =
        req.body;

      const { userId: editUserId } = req.params;

      // finding user from id
      const userFound = await prisma.user.findFirst({
        where: {
          id: parseInt(editUserId),
        },
      });

      if (userFound) {
        const updatedData = await prisma.user.update({
          where: {
            id: parseInt(editUserId),
          },
          data: {
            id: parseInt(userId),
            username: name,
            password,
            crmEmail,
            crmPassword,
            agentMobile,
          },
        });

        res.json({ message: "user updated successfully!", data: updatedData });
      } else {
        res.json({ message: "user not found!" });
      }
    } catch (error) {
      console.log("error while updating user ", error);
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
}

module.exports = new UserController();
