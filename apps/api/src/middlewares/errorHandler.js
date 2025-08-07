const AppError = require("../errors/AppError");

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message;

  if (!(err instanceof AppError)) {
    error = new AppError("Internal Server Error", 500);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
}

module.exports = errorHandler;
