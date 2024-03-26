function handleError(err, req, res, next) {
  console.log("custom error handler called! ->", err.meta);
  if (err.code === "P2002" && err.meta && err.meta.target === "PRIMARY") {
    res.json({
      error: err,
      message: "User with the same User id already exists.",
    });
  } else if (
    err.code === "P2002" &&
    err.meta &&
    err.meta.target === "User_crmEmail_key"
  ) {
    res.status(400).json({
      error: err,
      message: "User with the same Email already exists.",
    });
  } else if (
    err.code === "P2002" &&
    err.meta &&
    err.meta.target === "User_agentMobile_key"
  ) {
    res.status(400).json({
      error: err,
      message: "User with the same Mobile no already exists.",
    });
  } else {
    // Handle other errors or generic errors
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = handleError;
