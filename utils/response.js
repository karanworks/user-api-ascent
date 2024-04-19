class Response {
  success(res, message, data = {}, status = "success") {
    return res.json({
      message,
      data,
      status,
    });
  }

  error(res, message, data = {}, status = "failure") {
    return res.json({ message, data, status });
  }
}

module.exports = new Response();
