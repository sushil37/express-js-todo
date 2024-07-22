const successResponse = (res, message, data = [], statusCode = 200,) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Internal server error" });
};
export {successResponse, errorResponse, handleError}