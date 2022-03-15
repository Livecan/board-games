class UnauthorizedError extends Error {
  static code = 403;
  static message = "Unauthorized";
}

export default UnauthorizedError;
