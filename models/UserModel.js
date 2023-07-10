const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 6,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },
  role: {
    type: ["admin", "user"],
    default: "user",
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
