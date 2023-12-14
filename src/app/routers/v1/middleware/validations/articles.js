const { validationResult, body } = require("express-validator");
const serviceResponse = require("../../../../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../../../../utils/constants/httpStatus");
const { evaluateValidationRules } = require("./");

const newArticle = async function (req, res, next) {
  try {
    const validationRules = [
      body("title")
        .exists()
        .withMessage("Article title is required")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Article title can not be empty"),
      body("content")
        .exists()
        .withMessage("Article content is required")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Article content can not be empty"),
    ];
    await evaluateValidationRules(validationRules, req);
    return next();
  } catch (err) {
    res.statusCode = HTTP_STATUS.BAD_REQUEST;
    return next(err);
  }
};

const updateArticle = async function (req, res, next) {
  try {
    const validationRules = [
      body("title")
        .optional()
        .trim()
        .not()
        .isEmpty()
        .withMessage("Article title can not be empty"),
      body("content")
        .optional()
        .trim()
        .not()
        .isEmpty()
        .withMessage("Article content can not be empty"),
    ];
    await evaluateValidationRules(validationRules, req);
    return next();
  } catch (err) {
    res.statusCode = HTTP_STATUS.BAD_REQUEST;
    return next(err);
  }
};

module.exports = {
  newArticle,
  updateArticle,
};
