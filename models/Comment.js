const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    post: { type: mongoose.Types.ObjectId, ref: "post", required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
