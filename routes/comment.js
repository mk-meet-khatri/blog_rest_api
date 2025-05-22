const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const { commentController } = require("../controllers");
const {
  idValidator,
  addCommentValidator,
  updateCommentValidator,
} = require("../validators/comment");
const validate = require("../validators/validate");

router.post(
  "/",
  isAuth,
  addCommentValidator,
  validate,
  commentController.addComment
);

router.put(
  "/:id",
  isAuth,
  idValidator,
  updateCommentValidator,
  validate,
  commentController.updateComment
);

router.delete(
  "/:id",
  isAuth,
  idValidator,
  validate,
  commentController.deleteComment
);

router.get("/", isAuth, commentController.getComments);

router.get("/:id", isAuth, idValidator, validate, commentController.getComment);

module.exports = router;
