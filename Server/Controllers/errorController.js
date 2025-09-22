import cusError from "../utils/cusError.js";

const senErrorProd = (err, req, res) => {
  console.log("Something going on: =============");
  console.log(err);
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send a message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't show error details
    console.error("ERROR!", err);
    return res.status(500).json({
      status: "error",
      msg: "something went very wrong!",
    });
  }
};

const handleMongooseError = (err) => {
  return new cusError(err.message, 400);
};

const handleServerError = (err) => {
  const [, secondPart, thirdPart] = err.message.split(":");

  let message = `Invalid input data: ${thirdPart}`;

  if (thirdPart.endsWith("path_1_user_1 dup key"))
    message = "A user can only rate the same path once.";

  return new cusError(message, 400);
};

const handleValidationError = (err) => {
  const message = err.message.split(":")[2].trim();
  console.log(message);

  return new cusError(message, 400);
};

const handleJWTExpireError = (err) => {
  return new cusError("Your token has expired! Please Login again", 401);
};

const handleJWTError = (err) => {
  return new cusError("Your token has some issue, please logout and re login", 401);
};

export default (err, req, res, next) => {
  console.log("=========ERROR STARTS============");
  console.log(err);
  console.log("=========END OF ERROR============");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, name: err?.name, message: err.message };

  // Regular Mongo Validation Error
  if (error?.name === "ValidationError") error = handleValidationError(error);
  if (error?.name === "MongooseError") error = handleMongooseError(error);

  // Complex Validator Error
  if (error?.name === "MongoServerError") error = handleServerError(error);

  // JWT Error
  if (error?.name === "TokenExpiredError") error = handleJWTExpireError(error);
  if (error?.name === "JsonWebTokenError") error = handleJWTError(error);

  senErrorProd(error, req, res);
};
