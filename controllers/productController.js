const { StatusCodes } = require("http-status-codes");
const ProductModel = require("../models/ProductModel");
const { NotFoundError, BadRequestError } = require("../errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await ProductModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  res.send("get All Products");
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found!");
  }
  return res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    company,
    price,
    image,
    colors,
    featured,
    freeShipping,
    inventory,
  } = req.body;

  const { id } = req.params;

  const updatingFields = {
    name,
    description,
    category,
    company,
    price,
    image,
    colors,
    featured,
    freeShipping,
    inventory,
  };

  for (let entry of Object.entries(updatingFields)) {
    if (typeof entry[1] === "undefined") {
      throw new BadRequestError("Please provide all the fields");
    }
  }

  const product = await ProductModel.findOneAndUpdate(
    { _id: id },
    updatingFields,
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    throw new NotFoundError("Product not found!");
  }
  return res.status(StatusCodes.OK).json({});
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
