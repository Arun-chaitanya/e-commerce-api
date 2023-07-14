const { StatusCodes } = require("http-status-codes");
const ProductModel = require("../models/ProductModel");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await ProductModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  res.send("get All Products");
};

const getSingleProduct = async (req, res) => {
  res.send("get Single Product");
};

const updateProduct = async (req, res) => {
  res.send("update Product");
};

const deleteProduct = async (req, res) => {
  res.send("delete Product");
};

const uploadImage = async (req, res) => {
  res.send("upload Image");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
