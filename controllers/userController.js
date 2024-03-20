const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class UserController {
  async userRegister(req, res) {
    try {
      const { id, username, password, crmEmail, crmPassword, agentMobile } =
        req.body;

      // user ip
      const userIp = req.socket.remoteAddress;

      // admin that is creating the user
      const adminId = parseInt(req.params.adminId);

      await prisma.user.create({
        data: {
          id,
          username,
          password,
          crmEmail,
          crmPassword,
          agentMobile,
          userIp,
          adminId,
        },
      });

      res.status(201).json({ message: "user registration successful" });
    } catch (error) {
      console.log("error while registration user ->", error);
    }
  }

  async userLogin(req, res) {
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
}

module.exports = new UserController();
