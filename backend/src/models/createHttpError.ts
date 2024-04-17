class HttpError extends Error {
  code: number;
  constructor(code: number) {
    super();
    this.code = code;
  }
}

const createHttpError = (message: any, code: any) => {
  // const error = new Error(message);
  const error = new HttpError(code);
  error.message = message;
  // error.code = code;
  return error;
};

export default createHttpError;
