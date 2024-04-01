const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AdminUsers {
  async adminUsersGet(req, res) {
    try {
      const token = req.cookies.token;

      console.log("token", token);

      if (token) {
        const loggedInUser = await prisma.user.findFirst({
          where: {
            token: parseInt(token),
          },
          select: {
            id: true,
            email: true,
            password: true,
          },
        });

        console.log("logged in user ->", loggedInUser);

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
          message: "users fetched!",
          data: { ...adminDataWithoutPassword, users },
          status: "success",
        });
      } else {
        res.status(401).json({ message: "user not already logged in." });
      }
    } catch (error) {
      console.log("error while getting users", error);
    }
  }
}

module.exports = new AdminUsers();
