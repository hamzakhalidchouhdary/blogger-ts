const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateHashedPassword = async function (plainString) {
  try {
    return bcrypt.hash(plainString, await bcrypt.genSalt(10));
  } catch (err) {
    throw err;
  }
};

const compareHashedPassword = async function (plainPassword, hashedPassword) {
  try {
    return bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    throw err;
  }
};

const generateJWT = async function (payload) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(payload, secret);
  } catch (err) {
    throw err;
  }
};

const verifyJWT = async function (token) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret, function (err, payload) {
      if (err) throw err;
      return payload;
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  generateHashedPassword,
  compareHashedPassword,
  generateJWT,
  verifyJWT,
};
