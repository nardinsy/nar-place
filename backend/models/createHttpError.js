const createHttpError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

exports.createHttpError = createHttpError;
