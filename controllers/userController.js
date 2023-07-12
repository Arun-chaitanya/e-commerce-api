const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/UserModel");
const {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await UserModel.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id: ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
// Update user with find one and update
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!email || !name) {
//     throw new BadRequestError("Please password email and name");
//   }

//   const user = await UserModel.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    throw new BadRequestError("Please password email and name");
  }

  const user = await UserModel.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide both values");
  }
  const { userId } = req.user;
  const user = await UserModel.findOne({ _id: userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
