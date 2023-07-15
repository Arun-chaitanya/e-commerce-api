const { StatusCodes } = require("http-status-codes");
const ProductModel = require("../models/ProductModel");
const { NotFoundError, BadRequestError } = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await ProductModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await ProductModel.find({});
  return res.status(StatusCodes.OK).json({ products, count: products.length });
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
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found!");
  }
  await product.remove();
  return res.status(StatusCodes.OK).json({ msg: "Success! Product Removed." });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload Image");
  }

  const MAX_SIZE = 1024 * 1024;
  if (productImage.size > MAX_SIZE) {
    throw new BadRequestError("Please upload Image less than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + productImage.name
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.CREATED)
    .json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
