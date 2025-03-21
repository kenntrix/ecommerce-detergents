import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (request, response, next) => {
  const token = request.cookies.access_token;
  if (!token) {
    return next(
      errorHandler(401, "You are not logged in. Please login or register.")
    );
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(
        errorHandler(401, "Invalid or expired token. Please login again.")
      );
    }
    request.user = user;
    next();
  });
};
