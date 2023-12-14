const { validationResult } = require("express-validator");
const ServiceResponse = require("../../../../../utils/common/serviceResponse");

const evaluateValidationRules = async function (rules, req) {
  await Promise.all(rules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (errors.isEmpty()) return;
  throw errors.array();
};

const errorHandler = ServiceResponse.error;

module.exports = {
  evaluateValidationRules,
  errorHandler
};
