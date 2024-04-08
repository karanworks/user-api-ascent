class Response {
  success(res, message, data = {}, status = "success") {
    return res.json({
      message,
      data,
      status,
    });
  }

  error(res, message, status = "failure") {
    return res.json({ message, status });
  }
}

module.exports = new Response();
