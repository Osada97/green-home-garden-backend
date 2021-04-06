const e = require("express");
const BlogComments = require("../models/BlogComments");

//chicking comment user id is equal to current user id
const cmtUserAuth = async (req, res, next) => {
  const commentId = req.params.Id;
  await BlogComments.findById(commentId, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    if (result) {
      if (result.userId != req.user._id) {
        return res.status(400).json({
          message:
            "Can not edit this comment because This user not belong this comment",
        });
      } else {
        next();
      }
    } else {
      res.status(400).json({
        message: "Comment id is invalied",
      });
    }
  });
};

//cheking comment id is belong to user created blog and this middleware is use for delte blog comment in blog user role
const usersBlogComment = async (req, res, next) => {
  const commentid = req.params.Id;

  await BlogComments.findById(commentid, async function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      if (result.blogId.author_id != req.user._id) {
        res
          .status(400)
          .json({ message: "This User can not delete other comments" });
      } else {
        next();
      }
    } else {
      return res.status(400).json({
        message: "Comment id Is Invalied",
      });
    }
  }).populate("blogId");
};

module.exports = {
  cmtUserAuth,
  usersBlogComment,
};
