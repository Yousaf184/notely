export function createError(statusCode, data) {
  const error = new Error();
  error.statusCode = statusCode;
  error.data = data;
  return error;
}
