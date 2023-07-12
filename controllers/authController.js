const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/UserModel");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const {
  createJWT,
  attachCookiesToResponse,
  createTokenUser,
} = require("../utils");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please password email and password");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).send();
};

const register = async (req, res) => {
  const { email, name, password } = req.body;

  //controller way of checking whether user already exists. Otherwise schema will check and give validation error
  // const emailAlreadyExists = await UserModel.findOne({ email });
  // if (emailAlreadyExists) {
  //   throw new BadRequestError("Email already exists");
  // }

  const isFirstAccount = (await UserModel.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await UserModel.create({ email, name, password, role });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  return res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

module.exports = {
  login,
  logout,
  register,
};
