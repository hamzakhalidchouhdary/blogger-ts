const { verifyJWT } = require("../../../../utils/common/auth");
const ServiceResponse = require("../../../../utils/common/serviceResponse");
const ERROR_TEXT = require("../../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../../utils/constants/httpStatus");
const UserModule = require("../../../modules/user");

const authorizeUser = async function (req, res, next) {
  try {
    if (!req.headers.authorization)
      throw Object({
        message: ERROR_TEXT.NO_AUTH_HEADER,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      throw Object({
        message: ERROR_TEXT.NO_AUTH_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    const { userId } = await verifyJWT(token);
    req.user = await UserModule.getUser(userId);
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  authorizeUser,
};
