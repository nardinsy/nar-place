const { validationResult } = require("express-validator");
const { createHttpError } = require("../models/createHttpError");

const checkValidationResult = (req, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Nardin Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }
};

exports.checkValidationResult = checkValidationResult;
