const globalError = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res, statusCode, status, message);
  } else {
    sendErrorForProd(res, statusCode, status, message);
  }
};

const sendErrorForDev = (err, res, statusCode, status, message) => {
  return res.status(statusCode).json({
    status: status,
    error: err,
    message: message,
    stack: err.stack, // where the error and details // (OR) Log the error stack trace
  });
};

const sendErrorForProd = (res, statusCode, status, message) => {
  return res.status(statusCode).json({
    status: status,
    message: message,
  });
};

module.exports = globalError;
