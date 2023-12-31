const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
    "createToken passed user without isAdmin property");

  let payload = {
    email: user.email,
    userId: user.userId,
    isAdmin: user.isAdmin || false,
  };
  console.log(payload)
  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
