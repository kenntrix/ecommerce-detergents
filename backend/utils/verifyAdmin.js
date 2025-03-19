import { errorHandler } from "./error.js";

// Middleware: Check if user is an admin
export const verifyAdmin = async (request, response, next) => {
  try {
    const user = request.user;

    // Check if the user exists and is an admin
    if (!user || user.role !== "admin") {
      return next(
        errorHandler(403, "Access denied. Only admins can perform this action.")
      );
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(errorHandler(500, "Error verifying admin role"));
  }
};
