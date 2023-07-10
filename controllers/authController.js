const { StatusCodes } = require("http-status-codes");
const UserModel = require("../models/UserModel");
const { BadRequestError } = require("../errors");
const login = async (req, res) => {
  return res.send("login");
};

const logout = async (req, res) => {
  return res.send("logout");
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
  return res.status(StatusCodes.CREATED).json({ user });
};

module.exports = {
  login,
  logout,
  register,
};
