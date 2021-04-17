const BlogComments = require("../models/BlogComments");
const ReplyComment = require("../models/ReplyComment");
const StepComments = require("../models/StepComments");
const { blogCommentValidation } = require("../validaton");

const addReplyCmt = async (req, res) => {
  const id = req.params.Id;
  const modelType = req.params.mtype;
  let type = "";

  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  if (modelType == "blog") {
    type = "Comments";
  } else if (modelType == "steps") {
    type = "StepComments";
  } else {
    return res.status(400).send("please send correct model type");
  }

  const replycomment = new ReplyComment({
    ParentComment: id,
    userId: req.user._id,
    onModel: type,
    name: req.body.name,
    body: req.body.body,
  });

  await replycomment.save(function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    //adding comment id to the step and blog comment
    if (modelType == "blog") {
      BlogComments.findByIdAndUpdate(
        result.ParentComment,
        {
          $push: {
            reply_comment: result._id,
          },
        },
        { new: true, useFindAndModify: true },
        function (err, bresult) {
          if (err) {
            return res.status(400).send(err);
          }

          return res.json({
            message: "Added reply comment to the blog comments",
            result,
          });
        }
      );
    } else if (modelType == "steps") {
      StepComments.findByIdAndUpdate(
        result.ParentComment,
        {
          $push: {
            reply_comment: result._id,
          },
        },
        { new: true, useFindAndModify: true },
        function (err, sresult) {
          if (err) {
            return res.status(400).send(err);
          }

          return res.json({
            message: "Added reply comments to the steps comments",
            result,
          });
        }
      );
    }
  });
};

//edit reply comments
const editReplyComment = async (req, res) => {
  const id = req.params.Id;

  const { error } = blogCommentValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  await ReplyComment.findByIdAndUpdate(
    id,
    {
      $set: {
        name: req.body.name,
        body: req.body.body,
      },
    },
    { useFindAndModify: true, new: true },
    function (err, result) {
      if (err) {
        return res.status(400).send(err);
      }

      return res.json({ message: "Reply Comment Edited Successfully", result });
    }
  );
};

//delete reply comment that user added
const deleteUserRComment = async (req, res) => {
  const id = req.params.Id;

  await ReplyComment.findByIdAndDelete({ _id: id }, function (err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    if (!result) {
      return res.status(400).json({ message: "Reply comment id is invalid" });
    } else {
      //remove id from parent comment
      const modelType = result.onModel;

      if (modelType == "Comments") {
        BlogComments.findByIdAndUpdate(
          result.ParentComment,
          {
            $pull: {
              reply_comment: result._id,
            },
          },
          { useFindAndModify: true, new: true },
          function (err, bresult) {
            if (err) {
              return res.status(400).send(err);
            }
            if (!bresult) {
              return res
                .status(400)
                .json({ message: "Reply blog comment id is invalid" });
            }

            return res.json({ message: `${id} reply comment is deleted` });
          }
        );
      } else if (modelType == "StepComments") {
        StepComments.findByIdAndUpdate(
          result.ParentComment,
          {
            $pull: {
              reply_comment: result._id,
            },
          },
          { useFindAndModify: true, new: true },
          function (err, sresult) {
            if (err) {
              return res.status(400).send(err);
            }
            if (!sresult) {
              return res
                .status(400)
                .json({ message: "Reply step comment id is invalid" });
            }

            return res.json({ message: `${id} reply comment is deleted` });
          }
        );
      }
    }
  });
};

//get one reply comment
const getReplycmt = async (req, res) => {
  const id = req.params.Id;

  await ReplyComment.findById(id, function (err, result) {
    if (err) {
      return res.status(401).send(err);
    }
    if (!result) {
      return res.status(401).json({ message: "Reply Comment Id Is Invalid" });
    }

    return res.send(result);
  });
};

module.exports = {
  addReplyCmt,
  editReplyComment,
  deleteUserRComment,
  getReplycmt,
};
