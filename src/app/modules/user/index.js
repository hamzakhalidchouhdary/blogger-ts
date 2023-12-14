const UserModel = require("../../models/index").User;
const ERROR_TEXT = require("../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const USER_ROLES = require("../../../utils/constants/userRoles");
const Admin = require("./admin");
const Manager = require("./manager");
const Reader = require("./reader");
const User = require("./user");

module.exports = {
  getUser: async function (userId) {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails)
      throw Object({
        message: ERROR_TEXT.NO_USER,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    let user = {};
    switch (userDetails.role) {
      case USER_ROLES.ADMIN:
        user = new Admin(userDetails);
        break;
      case USER_ROLES.MANAGER:
        user = new Manager(userDetails);
        break;
      case USER_ROLES.READER:
        user = new Reader(userDetails);
        break;
      default:
        throw Object({
          message: ERROR_TEXT.UNSUPPORTED_USER_ROLE,
          status: HTTP_STATUS.UNAUTHORIZED,
        });
    }
    return user;
  },
};
