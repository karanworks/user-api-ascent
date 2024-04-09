const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getLoggedInUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    const adminUser = await prisma.user.findFirst({
      where: {
        token: parseInt(token),
      },
    });
    return adminUser;
  }
}

module.exports = getLoggedInUser;
