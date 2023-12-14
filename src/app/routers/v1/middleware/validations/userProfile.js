const { validationResult, body } = require("express-validator");
const serviceResponse = require("../../../../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../../../../utils/constants/httpStatus");
const { evaluateValidationRules } = require("./");

const newProfile = async function (req, res, next) {
  try {
    const validationRules = [
      body("firstName").notEmpty().withMessage("First name can not be empty"),
      body("lastName").notEmpty().withMessage("Last name can not be empty"),
      body("username").notEmpty().withMessage("username can not be empty"),
      body("hashedPassword")
        .notEmpty()
        .withMessage("Password can not be empty"),
    ];
    await evaluateValidationRules(validationRules, req);
    return next();
  } catch (err) {
    res.statusCode = HTTP_STATUS.BAD_REQUEST;
    return next(err);
  }
};

const updateProfile = async function (req, res, next) {
  try {
    const validationRules = [
      body("firstName")
        .optional()
        .notEmpty()
        .withMessage("First name can not be empty"),
      body("lastName")
        .optional()
        .notEmpty()
        .withMessage("Last name can not be empty"),
      body("username")
        .optional()
        .notEmpty()
        .withMessage("username can not be empty"),
      body("hashedPassword")
        .optional()
        .notEmpty()
        .withMessage("Password can not be empty"),
    ];
    await evaluateValidationRules(validationRules, req);
    return next();
  } catch (err) {
    res.statusCode = HTTP_STATUS.BAD_REQUEST;
    return next(err);
  }
};

module.exports = {
  newProfile,
  updateProfile,
};
