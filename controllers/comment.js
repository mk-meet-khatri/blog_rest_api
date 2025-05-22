const { Comment, Post } = require("../models");
const mongoose = require("mongoose");

const addComment = async (req, res, next) => {
  try {
    const { post, content } = req.body;
    const { _id } = req.user;

    const isPostExist = await Post.findById(post);
    if (!isPostExist) {
      res.code = 404;
      throw new Error("Post not found!");
    }

    const newComment = new Comment({
      post,
      content,
      author: _id,
    });

    await newComment.save();

    res
      .status(201)
      .json({ code: 201, status: true, message: "Comment Added Succesfully!" });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { _id, role } = req.user;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.code = 404;
      throw new Error("Comment not found!");
    }

    if (comment.author.toString() !== _id.toString() && role !== 1) {
      res.code = 404;
      throw new Error("Unauthorized to update this comment!");
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Comment Updated Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id, role } = req.user;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.code = 404;
      throw new Error("Comment not found!");
    }

    if (comment.author.toString() !== _id.toString() && role !== 1) {
      res.code = 404;
      throw new Error("Unauthorized to update this comment!");
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Comment Deleted Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { page, size, q, post } = req.query;

    if (post && !mongoose.Types.ObjectId.isValid(post)) {
      res.code = 404;
      throw new Error("Invalid Post ID!");
    }

    if (post) {
      const isPostExist = await Post.findById(post);
      if (!isPostExist) {
        res.code = 404;
        throw new Error("Post not found!");
      }
    }

    const pageNumber = parseInt(page) || 1;
    const sizeNumber = parseInt(size) || 10;
    let query = {};

    if (q) {
      const search = new RegExp(q, "i");

      query = {
        $or: [{ title: search }],
      };
    }

    if (post) {
      query = { ...query, post };
    }
    // console.log(query);

    const total = await Comment.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const comments = await Comment.find(query)
      .populate("post")
      .populate("author", "-password -verificationCode -forgotPasswordCode")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Comments List Successfully!",
      data: { comments, total, pages },
    });
  } catch (error) {
    next(error);
  }
};

const getComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate("post")
      .populate("author", "-password -verificationCode -forgotPasswordCode");

    if (!comment) {
      res.code = 404;
      throw new Error("Comment not found!");
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Comment Successfully!",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  updateComment,
  deleteComment,
  getComments,
  getComment,
};
