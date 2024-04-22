const getLoggedInUser = require("../utils/getLoggedInUser");
const response = require("../utils/response");
const session = require("../utils/session");

class UpdateSessionController {
  async updateSessionPatch(req, res) {
    try {
      const loggedInUser = await getLoggedInUser(req, res);

      if (loggedInUser) {
        if (loggedInUser.isActive) {
          await session(loggedInUser.adminId, loggedInUser.id);

          response.success(res, "Session updated!");
        }
      } else {
        response.error(res, "User not logged in!");
      }
    } catch (error) {
      console.log("error while updating session", error);
    }
  }
}
module.exports = new UpdateSessionController();
