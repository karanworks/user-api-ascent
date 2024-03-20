const { PrismaClient } = require("@prisma/client");
const express = require("express");
const adminUsersRouter = express.Router();

const prisma = new PrismaClient();
adminUsersRouter.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const loggedInUser = await prisma.admin.findFirst({
        where: {
          token: parseInt(token),
        },
        select: {
          id: true,
          email: true,
          password: true,
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

      const { password, ...adminDataWithoutPassword } = loggedInUser;

      res.status(200).json({
        message: "users fetched!",
        data: { ...adminDataWithoutPassword },
        status: "success",
      });
    } else {
      res.status(401).json({ message: "admin not already logged in." });
    }
  } catch (error) {
    console.log("error while loggin in admin, get method ", error);
  }
});

module.exports = adminUsersRouter;