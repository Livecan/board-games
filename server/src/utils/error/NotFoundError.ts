class NotFoundError extends Error {
  static code = 404;
  static message = "Not Found";
}

export default NotFoundError;
