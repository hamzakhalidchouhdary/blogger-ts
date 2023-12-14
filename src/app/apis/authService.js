const UserModel = require("../models").User;
const {
  generateJWT,
  compareHashedPassword,
} = require("../../utils/common/auth");
const ServiceResponse = require("../../utils/common/serviceResponse");
const ERROR_TEXT = require("../../utils/constants/errorText");
const HTTP_STATUS = require("../../utils/constants/httpStatus");

const signupNewUser = async function (req, res, next) {
  try {
    const { body: userDetails } = req;
    const newUser = await UserModel.new(userDetails);
    const jwToken = await generateJWT({ userId: newUser.id });
    res.status(HTTP_STATUS.CREATED).json({ token: jwToken });
    return;
  } catch (err) {
    return next(err);
  }
};

const loginUser = async function (req, res, next) {
  try {
    const { username = null, password = null } = req.body;
    const user = await UserModel.findByUsername(username);
    if (
      !user ||
      !password ||
      !(await compareHashedPassword(password, user.hashedPassword))
    )
      throw Object({
        message: ERROR_TEXT.INVALID_CREDENTIALS,
        status: HTTP_STATUS.BAD_REQUEST,
      });
    const token = await generateJWT({ userId: user.id });
    res.status(HTTP_STATUS.OK).json({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  signupNewUser,
  loginUser,
};
