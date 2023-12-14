const ERROR_TEXT = require("../../../utils/constants/errorText");
const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const User = require("./user");

function Reader(userDetails) {
  User.call(this, userDetails);

  this.createArticle = function () {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.CREATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  this.updateArticle = function () {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.UPDATE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
}

Reader.prototype = new User();
Reader.prototype.role = "reader";

module.exports = Reader;
