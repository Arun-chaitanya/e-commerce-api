const mongoose = require("mongoose");

const connectDB = async (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("CONNECTED TO MONGODB..."));
};

module.exports = connectDB;
