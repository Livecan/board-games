class InvalidValueError extends Error {
  static code = 400;
  static message = "Invalid value";
}

export default InvalidValueError;
