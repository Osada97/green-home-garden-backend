const e = require("express");
const BlogComments = require("../models/BlogComments");
const BlogSteps = require("../models/BlogSteps");
const ReplyComment = require("../models/ReplyComment");
const StepComments = require("../models/StepComments");

//checking comment user id is equal to current user id
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

//checking comment id is belong to user created blog and this middleware is use for delete blog comment in blog user role
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

//checking step comment belongs current user
const stepcmtUserAuth = async (req, res, next) => {
  const commentId = req.params.Id;
  await StepComments.findById(commentId, function (err, result) {
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

//checking blog step comment user is equal to the parent blog user
const authParentBlogStep = async (req, res, next) => {
  const commentId = req.params.Id;

  await StepComments.findById(commentId, async function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      if (result.stepId.parent_blog.author_id != req.user._id) {
        res
          .status(400)
          .json({ message: "Current User Cannot Delete This comment" });
      } else {
        next();
      }
    } else {
      return res.status(400).json({ message: "Comment Id is Invalid" });
    }
  }).populate({ path: "stepId", populate: { path: "parent_blog" } });
};

/* Reply comments goes in here */
//checking reply comment user idn is equal to the current user (reply comment edit/reply comment delete)
const authReplyCmt = (req, res, next) => {
  const id = req.params.Id;
  ReplyComment.findById(id, function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (!result) {
      return res.status(400).json({ message: "Reply comment id is invalid" });
    } else {
      if (result.userId != req.user._id) {
        return res.status(400).json({
          message: "This User cannot edit this comment",
        });
      } else {
        next();
      }
    }
  });
};

module.exports = {
  cmtUserAuth,
  usersBlogComment,
  stepcmtUserAuth,
  authParentBlogStep,
  authReplyCmt,
};
