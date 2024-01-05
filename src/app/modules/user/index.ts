const UserModel = require("../../models/index").User;
const ERROR_TEXT = require("../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const USER_ROLES = require("../../../utils/constants/userRoles");
const Admin = require("./admin");
const User = require("./user");
const Manager = require("./manager");
const Reader = require("./reader");
import _ from "lodash";

export type NumberOrNull = number | null

export interface UserDetails {
  id: NumberOrNull,
  firstName: string,
  lastName: string,
  username: string,
  role: string
}

export interface Error {
  message: string,
  status: number
}

module.exports = {
  getUser: async function (userId: number): Promise<typeof User> {
    const userDetails = await UserModel.findById(userId);
    if (!userDetails)
      throw Object({
        message: ERROR_TEXT.NO_USER,
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    let user: typeof User;
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
