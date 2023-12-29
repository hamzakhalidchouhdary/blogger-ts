const ERROR_TEXT = require("../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const User = require("./user.ts");

class Reader extends User {
  constructor(userDetails) {
    super(userDetails);
    this.role = "reader";
  }

  createArticle = function () {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.CREATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  updateArticle = function () {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.UPDATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
}

module.exports = Reader;
