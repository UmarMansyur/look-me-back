class ApiError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static notFound(message) {
    throw new ApiError(404, message);
  }

  static internal(message) {
    throw new ApiError(500, message);
  }

  static badRequest(message) {
    throw new ApiError(400, message);
  }

  static unauthorized(message) {
    throw new ApiError(401, message);
  }
}

module.exports = ApiError;
