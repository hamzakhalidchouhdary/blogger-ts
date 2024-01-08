const ERROR_TEXT = require("../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const User = require("./user");
import { UserDetails, Error } from "../../../utils/common/interfaces";

class Reader extends User {
  constructor(userDetails: UserDetails) {
    super(userDetails);
    this.role = "reader";
  }

  createArticle: Function = function (): Error {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.CREATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  updateArticle: Function = function (): Error {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.UPDATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
}

module.exports = Reader;
