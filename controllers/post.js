const { File, Category, Post } = require("../models");
const mongoose = require("mongoose");

const addPost = async (req, res, next) => {
  try {
    const { title, content, file, category } = req.body;
    const { _id } = req.user;

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        res.code = 404;
        throw new Error("File not found!");
      }
    }

    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      res.code = 404;
      throw new Error("Category not found!");
    }

    const newPost = new Post({
      title,
      content,
      file,
      category,
      author: _id,
      updatedBy: _id,
    });

    await newPost.save();

    res
      .status(201)
      .json({ code: 201, status: true, message: "Post Added Successfully!" });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { title, content, file, category } = req.body || {};
    const { id } = req.params;
    const { _id } = req.user;

    if (!title && !content && !file && !category) {
      res.code = 404;
      throw new Error(
        "At least one field (title or content or file or category) is required to update!"
      );
    }

    if (file) {
      const isFileExist = await File.findById(file);
      if (!isFileExist) {
        res.code = 404;
        throw new Error("File not found!");
      }
    }

    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        res.code = 404;
        throw new Error("Category not found!");
      }
    }

    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found!");
    }

    post.title = title ? title : post.title;
    post.content = content;
    post.file = file;
    post.category = category ? category : post.category;
    post.updatedBy = _id;

    await post.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Post Updated Successfully!",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      res.code = 404;
      throw new Error("Post not found!");
    }

    await Post.findByIdAndDelete(id);

    res
      .status(200)
      .json({ code: 200, status: true, message: "Post Deleted Successfully!" });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page, size, q, category } = req.query;

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      res.code = 404;
      throw new Error("Invalid Category ID!");
    }

    if (category) {
      const isCategoryExist = await Category.findById(category);
      if (!isCategoryExist) {
        res.code = 404;
        throw new Error("Category not found!");
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

    if (category) {
      query = { ...query, category };
    }
    // console.log(query);

    const total = await Post.countDocuments(query);
    const pages = Math.ceil(total / sizeNumber);

    const posts = await Post.find(query)
      .populate("file")
      .populate("category")
      .populate("author", "-password -verificationCode -forgotPasswordCode")
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode")
      .sort({ updatedBy: -1 })
      .skip((pageNumber - 1) * sizeNumber)
      .limit(sizeNumber);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Posts List Successfully!",
      data: { posts, total, pages },
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("file")
      .populate("category")
      .populate("author", "-password -verificationCode -forgotPasswordCode")
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode");

    if (!post) {
      res.code = 404;
      throw new Error("Post not found!");
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Post Successfully!",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addPost, updatePost, deletePost, getPosts, getPost };
