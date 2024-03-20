const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class AdminController {
  async adminRegisterPost(req, res) {
    try {
      const { username, email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      await prisma.admin.create({
        data: { username, email, password, userIp },
      });

      res.status(201).json({ message: "admin registered successfully!" });
    } catch (error) {
      console.log("error while registration admin ->", error);
    }
  }

  async adminLoginPost(req, res) {
    try {
      const { email, password } = req.body;
      const userIp = req.socket.remoteAddress;

      // finding admin from email
      const adminFound = await prisma.admin.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!adminFound) {
        res.status(400).json({
          message: "no admin found with this email",
          status: "failure",
        });
      } else if (password === adminFound.password) {
        // generates a number between 1000 and 10000 to be used as token
        const loginToken = Math.floor(
          Math.random() * (10000 - 1000 + 1) + 1000
        );

        // updating admin's token, and isActive status
        const updatedAdmin = await prisma.admin.update({
          where: {
            id: adminFound.id,
            email,
          },
          data: {
            isActive: 1,
            token: loginToken,
            userIp,
          },

          include: {
            users: {
              select: {
                id: true,
                username: true,
                crmEmail: true,
                agentMobile: true,
              },
            },
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
          message: "admin logged in!",
          data: { ...adminDataWithoutPassword },
          status: "success",
        });
      } else {
        res.status(400).json({ message: "Wrong password!", status: "failure" });
      }
    } catch (error) {
      console.log("error while loggin in admin ", error);
    }
  }
  async adminLoginGet(req, res) {
    try {
      const cookies = req.cookies.token;
      console.log(cookies);

      res.send("admin get request triggered");
    } catch (error) {
      console.log("error while loggin in admin ", error);
    }
  }
  async adminLogoutGet(req, res) {
    try {
      res.clearCookie("token");
      console.log("logout api was called.");
      res.send({ message: "user logged out successflly!" });
    } catch (error) {
      console.log("error while loggin in admin ", error);
    }
  }
}

module.exports = new AdminController();
