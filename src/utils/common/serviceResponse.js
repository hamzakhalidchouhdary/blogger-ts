const HTTP_STATUS = require("../constants/httpStatus");
const RESPONSE_TEXT = require("../constants/errorText");

const errorResponse = function (err, req, res, next) {
  res.statusCode =
    res.statusCode === HTTP_STATUS.OK
      ? HTTP_STATUS.INTERNAL_ERROR
      : res.statusCode;
  const status = err.status || res.statusCode;
  const message = err.message || err || RESPONSE_TEXT.INTERNAL_ERROR;
  return res.status(status).send(message);
};

module.exports = {
  error: errorResponse
};
