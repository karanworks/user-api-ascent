const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cronJob = cron.schedule(
  "*/5 * * * * *",
  async () => {
    const sessions = await prisma.session.findMany({});
    const inactiveTimeLimit = 30; // in seconds
    const currentUTC = new Date(); // Get the current UTC time

    sessions.forEach(async (session) => {
      const lastActiveTime = new Date(session.lastActive);
      const timeDifference =
        (currentUTC.getTime() - lastActiveTime.getTime()) / 1000; // Convert milliseconds to seconds
      if (timeDifference > inactiveTimeLimit) {
        const inActiveUser = await prisma.user.findFirst({
          where: {
            id: session.userId,
          },
        });

        // logout the user
        await prisma.user.update({
          where: {
            id: inActiveUser.id,
          },
          data: {
            isActive: 0,
          },
        });
        // console.log(
        //   `${inActiveUser.username} is inactive for more than ${inactiveTimeLimit} seconds.`
        // );
      }
    });
  },
  {
    scheduled: true,
    timezone: "Etc/UTC",
  }
);

module.exports = cronJob;
