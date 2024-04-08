async function getToken(req, res) {
  return req.cookies.token;
}

module.exports = getToken;
