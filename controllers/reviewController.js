const { StatusCodes } = require("http-status-codes");
const ReviewModel = require("../models/ReviewModel");
const ProductModel = require("../models/ProductModel");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../errors");
const path = require("path");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const product = await ProductModel.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}`);
  }

  const alreadySubmitted = await ReviewModel.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new BadRequestError(
      "User has already submitted the review for this product."
    );
  }

  req.body.user = req.user.userId;

  const review = await ReviewModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await ReviewModel.find({});
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    throw new NotFoundError("review not found!");
  }
  return res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;

  const { id } = req.params;

  if (!rating || !title || !comment) {
    throw new BadRequestError("Please provide title, comment and rating");
  }

  const review = await ReviewModel.findOne({ _id: id });

  if (!review) {
    throw new NotFoundError(`No review found with id: ${id}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await ReviewModel.findById(id);
  if (!review) {
    throw new NotFoundError("review not found!");
  }

  checkPermissions(req.user, review.user);
  console.log(review);
  await review.deleteOne();
  return res.status(StatusCodes.OK).json({ msg: "Success! review Removed." });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
