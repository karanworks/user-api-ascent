class CRMConfiguration {
  async CRMConfigurationGet(req, res) {
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
            campaigns: {
              select: {
                crmFields: true,
              },
            },
          },
        });

        const { password, ...adminDataWithoutPassword } = loggedInUser;

        res.status(200).json({
          message: "crm fields fetched!",
          data: { ...adminDataWithoutPassword },
          status: "success",
        });
      } else {
        res.status(401).json({ message: "admin not already logged in." });
      }
    } catch (error) {
      console.log("error in crm Configuration controller", error);
    }
  }
}
