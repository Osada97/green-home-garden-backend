//this controller use for both blog and steps comments
const { findByIdAndDelete } = require("../models/BlogComments");
const BlogComments = require("../models/BlogComments");
const BlogSteps = require("../models/BlogSteps");
const PlantBlog = require("../models/PlantBlog");
const StepComments = require("../models/StepComments");
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

//blog steps comment controlles
const addStepComments = async (req, res) => {
  const stepId = req.params.Id;

  //validate comment
  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const stepcomment = new StepComments({
    stepId: stepId,
    userId: req.user._id,
    name: req.body.name,
    body: req.body.body,
  });

  await stepcomment.save().then((result) => {
    BlogSteps.findByIdAndUpdate(
      stepId,
      {
        $push: {
          comments: result._id,
        },
      },
      { useFindAndModify: true, new: true },
      function (err, results) {
        if (err) {
          return res.status(400).send(err);
        }

        return res.json({ message: "Blog Step Comment Added", result: result });
      }
    );
  });
};

//steps comment edit
const editStepComment = (req, res) => {
  const commentid = req.params.Id;

  //validate comment
  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  StepComments.findByIdAndUpdate(
    commentid,
    {
      $set: { name: req.body.name, body: req.body.body },
    },
    { useFindAndModify: true, new: true },
    function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json({
        message: `${result._id} Is Edit successfuly`,
      });
    }
  );
};

//step delete that user added
const stepsDelete = async (req, res) => {
  const stepsId = req.params.Id;

  await StepComments.findByIdAndDelete(stepsId, async function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (result) {
      BlogSteps.findByIdAndUpdate(
        result.stepId,
        {
          $pull: { comments: result._id },
        },
        function (err, result) {
          if (err) {
            return res.status(400).send(err);
          }
          res.json({ message: "Blog Step comment Successfully deleted" });
        }
      );
    } else {
      res.status(400).json({ message: "Invalied Step Comment Id" });
    }
  });
};

//delete blog steps that user have
const deleteuserStepsComment = async (req, res) => {
  const commentid = req.params.Id;

  await StepComments.findByIdAndDelete(commentid, async function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    if (result) {
      BlogSteps.findByIdAndUpdate(
        result.stepId,
        {
          $pull: { comments: result._id },
        },
        function (err, results) {
          if (err) {
            return res.status(400).send(err);
          }
          return res.json({
            message: "Blog Step Comment Successfully deleted",
          });
        }
      );
    } else {
      res.status(400).send("Blog Step Comment Is Invalied");
    }
  });
};

//get all blog steps comment
const getStepComment = async (req, res) => {
  const stepid = req.params.sid;

  await StepComments.find({ stepId: stepid }, function (err, result) {
    if (err) {
      res.status(400).send(err);
    }
    if (result) {
      res.send(result);
    } else {
      res.status(400).json({ message: "Stepd id Is invalied" });
    }
  });
};

module.exports = {
  blogCreateCommetns,
  editComment,
  deleteComments,
  deleteBlogcomment,
  getAllBlog,
  addStepComments,
  editStepComment,
  stepsDelete,
  deleteuserStepsComment,
  getStepComment,
};
