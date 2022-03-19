class PreconditionRequiredError extends Error {
  static code = 428;
  static message = "Precondition Required";
}

export default PreconditionRequiredError;
