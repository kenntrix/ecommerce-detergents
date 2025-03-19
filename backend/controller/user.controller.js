import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (request, response, next) => {
  const { username, email, password } = request.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    response
      .status(201)
      .json({ success: true, message: "User created successfully", newUser });
  } catch (error) {
    next(errorHandler(500, "Error occurred signing up", error));
  }
};

export const signin = async (request, response, next) => {
  const { email, password } = request.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const { password: pass, ...rest } = validUser._doc;
    response
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({
        success: true,
        message: "User has sign in successfully",
        user: rest,
      });
  } catch (error) {
    next(errorHandler(500, "Error occurred signing in", error));
  }
};

export const google = async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      response
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          request.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: request.body.email,
        password: hashedPassword,
        avatar: request.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      response
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(errorHandler(500, "Error occurred signing in with google"));
  }
};

export const signout = (request, response, next) => {
  try {
    response
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User has been signed out" });
  } catch (error) {
    next(errorHandler(500, "Error signing out."));
  }
};

export const updateUser = async (request, response, next) => {
  const { username, email, password } = request.body;

  // Ensure the user can only update their own account
  if (request.user.id !== request.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    // Prepare the update object
    const updateFields = {};

    if (username) {
      updateFields.username = username;
    }
    if (email) {
      updateFields.email = email;
    }
    if (password) {
      // Hash the password and add it to the updateFields object
      updateFields.password = bcryptjs.hashSync(password, 10);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Exclude sensitive fields from the response
    const { password: hashedPassword, ...rest } = updatedUser._doc;

    response.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: rest,
    });
  } catch (error) {
    next(errorHandler(500, "Error occurred while updaing user."));
  }
};

// Get all users
export const getAllUsers = async (request, response, next) => {
  const limit = parseInt(request.query.limit, 10) || 0;
  const { page = 1 } = request.query;
  const skip = (page - 1) * limit;

  try {
    let role = request.query.role;
    // If no specific role is requested or 'all' is specified, fetch all roles
    if (role === undefined || role === "all") {
      role = { $in: ["admin", "user"] };
    }

    const searchTerm = request.query.searchTerm || "";

    // Find users by role and search term
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
      role,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (!users.length) {
      return next(
        errorHandler(
          404,
          `Users not found for the specified search term, ${searchTerm}`
        )
      );
    }

    // Remove the password field from each user object
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user._doc;
      return userWithoutPassword;
    });

    // Get the total count of users for the given criteria
    const totalUsers = await User.countDocuments({
      username: { $regex: searchTerm, $options: "i" },
      role,
    });

    response.status(200).json({
      users: usersWithoutPassword,
      page,
      limit,
      totalUsers,
    });
  } catch (error) {
    next(errorHandler(500, "Error retrieving users from the database"));
  }
};
