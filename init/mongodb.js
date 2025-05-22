const mongoose = require("mongoose");
const { connectionURL } = require("../config/keys");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(connectionURL);
    console.log("Database Connection Successful!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectMongoDB;
