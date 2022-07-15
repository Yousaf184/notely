import util from "node:util";
import jwt from "jsonwebtoken";

// promisify jwt.verify()
const promisifiedJwtVerify = util.promisify(jwt.verify);

async function isLoggedIn(req, res, next) {
  try {
    const token = req.cookies._token;

    // if token doesn't exists, redirect to login page
    const { path } = req;
    const isAuthPageRoute = path === "/login" || path === "/signup";

    if (!token) {
      if (!isAuthPageRoute) {
        res.redirect("/auth/login");
      } else {
        next();
      }
    } else {
      if (isAuthPageRoute) {
        res.redirect("/notes");
      } else {
        const decodedToken = await promisifiedJwtVerify(
          token,
          process.env.JWT_SECRET_KEY
        );

        // Add the user's id from the token on the 'req' object.
        //
        // This can be used by the request handler that handles
        // the authenticated request to identify the user.
        req.userId = decodedToken.id;
        next();
      }
    }
  } catch (error) {
    // in case of invalid JWT, redirect to login page
    res.redirect("/auth/login");
  }
}

export default isLoggedIn;
