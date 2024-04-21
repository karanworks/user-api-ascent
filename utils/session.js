const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// checking if the user has adminId, it ensures that this is not an admin user
async function session(adminId, userId) {
  const sessionAlreadyExists = await prisma.session.findFirst({
    where: {
      userId,
    },
  });

  if (adminId) {
    // update session if there is a session that already exists for this user
    if (sessionAlreadyExists) {
      await prisma.session.update({
        where: {
          id: sessionAlreadyExists.id,
          userId,
        },

        data: {
          lastActive: new Date(),
        },
      });
    } else {
      // create session
      await prisma.session.create({
        data: {
          userId: userId,
          lastActive: new Date(),
        },
      });
    }
  }
}

module.exports = session;
