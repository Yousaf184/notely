import { ERROR_VIEW_PATH, STATUS_CODES } from "../utils/constants.js";

function expressErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode ?? STATUS_CODES.serverError;
  console.log(err);

  if (!err.data) {
    err.data = {
      view: ERROR_VIEW_PATH,
      errorMessage: "Something went wrong; try again after couple of minutes"
    };
  }

  const { view } = err.data;
  res.status(statusCode).render(view, err.data);
}

export default expressErrorHandler;
