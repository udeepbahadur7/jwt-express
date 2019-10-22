const jwt = require("jsonwebtoken");
// -------------------------------------------------------------
// Important
// -------------------------------------------------------
// Dont expose this
// use config files
const SECRET_JWT_KEY = "mysecret";
function createToken(user) {
  // add scope if you want to deal with permission
  return jwt.sign(
    {
      sub: user.userId,
      username: user.username,
      email: user.email
      //   role:
    },
    SECRET_JWT_KEY,
    { algorithm: "HS256", expiresIn: "1m" }
  );
}

module.exports = createToken;
