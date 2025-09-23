import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import catchAsync from "../utils/catchAsync.js";
import cusError from "../utils/cusError.js";

import User from "../Models/userModel.js";

export const hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

const correctPassword = async function (typedInPassword, dbSavedPassword) {
  if (!dbSavedPassword || !typedInPassword) return null;
  return await bcrypt.compare(typedInPassword, dbSavedPassword);
};

const signToken = (user) => {
  const { _id } = user;
  return jwt.sign({ id: _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  user.password = undefined;
  user.active = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new cusError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password +active");

  const correct = await correctPassword(password, user.password);

  if (!correct || !user) {
    return next(new cusError("Incorrect email or password", 401));
  }

  if (!user.active) {
    return next(new cusError("Please contact support to re-activate your account", 401));
  }

  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 1000),
  };

  res.cookie("jwt", "loggedOut", cookieOptions);

  res.status(200).json({
    status: "success",
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  // console.log(token);
  if (!token || !token.startsWith("Bearer"))
    return next(new cusError("You are not logged in, please login first", 401));

  token = token.split(" ")[1];

  if (token.trim() == "null")
    return next(new cusError("There is a token issue, please report it to us", 401));

  const result = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(result.id);

  if (!currentUser) {
    return next(new cusError("The user no longer exist", 401));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new cusError("You do not have permission to perform this action", 403));
    }
    next();
  };
};
