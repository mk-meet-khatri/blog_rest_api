const { check } = require("express-validator");
const mongoose = require("mongoose");

const idValidator = [
  check("id").custom(async (id) => {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw "Invalid Post ID!";
    }
  }),
];

const addCommentValidator = [
  check("post")
    .notEmpty()
    .withMessage("Post ID is required!")
    .custom(async (post) => {
      if (post && !mongoose.Types.ObjectId.isValid(post)) {
        throw "Invalid Post ID!";
      }
    }),
  check("content").notEmpty().withMessage("Content is required!"),
];

const updateCommentValidator = [
  check("content").notEmpty().withMessage("Content is required!"),
];

module.exports = { idValidator, addCommentValidator, updateCommentValidator };
