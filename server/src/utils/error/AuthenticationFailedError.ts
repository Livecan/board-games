class AuthenticationFailedError extends Error {
  static code = 401;
  static message = "Authentication Failed";
}

export default AuthenticationFailedError;
