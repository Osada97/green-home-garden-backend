//this controller use for both blog and steps comments
const BlogComments = require("../models/BlogComments");
const PlantBlog = require("../models/PlantBlog");
const { blogCommentValidation } = require("../validaton");

//blog comments

//create blog comments
const blogCreateCommetns = async (req, res) => {
  const blogId = req.params.blogId;

  //validate blog comment
  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const blogComment = new BlogComments({
    blogId: blogId,
    userId: req.user._id,
    name: req.body.name,
    body: req.body.body,
  });

  await blogComment
    .save()
    .then((result) => {
      PlantBlog.findByIdAndUpdate(
        blogId,
        {
          $push: { comments: result._id },
        },
        { useFindAndModify: true, new: true }
      )
        .then((result) => {
          res.json({ message: "Comment is added", result });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

//edit comment
const editComment = async (req, res) => {
  const commentId = req.params.Id;

  //validate edit
  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  await BlogComments.findByIdAndUpdate(
    commentId,
    {
      $set: {
        name: req.body.name,
        body: req.body.body,
      },
    },
    { useFindAndModify: true, new: true },
    function (err, result) {
      if (err) {
        return res.status(400).json(err);
      }
      res.json({
        message: "Comment Is Updated!",
        result,
      });
    }
  );
};

//delete comments
const deleteComments = async (req, res) => {
  const commentId = req.params.Id;

  await BlogComments.findByIdAndDelete(commentId, async function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      await PlantBlog.findByIdAndUpdate(
        result.blogId,
        {
          $pull: { comments: result._id },
        },
        { useFindAndModify: true, new: true },
        function (err, results) {
          res.json({ message: `${result._id} Comment deleted`, results });
        }
      );
    } else {
      return res.status(400).json({ message: "comment id is Invalied" });
    }
  });
};

//delete blog comments that blog user created blog
const deleteBlogcomment = async (req, res) => {
  const commentId = req.params.Id;
  await BlogComments.findByIdAndDelete(commentId, async function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      await PlantBlog.findByIdAndUpdate(
        result.blogId,
        {
          $pull: { comments: result._id },
        },
        { useFindAndModify: true, new: true },
        function (err, results) {
          res.json({ message: `${result._id} Comment deleted`, results });
        }
      );
    } else {
      return res.status(400).json({ message: "comment id is Invalied" });
    }
  });
};

//get all comments that blog have
const getAllBlog = async (req, res) => {
  const blogId = req.params.bId;

  await BlogComments.find({ blogId: blogId }, function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      return res.send(result);
    }
  });
};

module.exports = {
  blogCreateCommetns,
  editComment,
  deleteComments,
  deleteBlogcomment,
  getAllBlog,
};
