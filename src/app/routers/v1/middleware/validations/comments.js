const { body, validationResult } = require("express-validator");
const serviceResponse = require("../../../../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../../../../utils/constants/httpStatus");
const { evaluateValidationRules } = require("./");

const validateComment = async function (req, res, next) {
  try {
    const validationRules = [
      body("content")
        .exists()
        .withMessage("comment content is required")
        .notEmpty()
        .withMessage("comment content can not empty"),
    ];
    await evaluateValidationRules(validationRules, req);
    return next();
  } catch (err) {
    res.statusCode = HTTP_STATUS.BAD_REQUEST;
    return next(err);
  }
};

module.exports = {
  validateComment,
};
