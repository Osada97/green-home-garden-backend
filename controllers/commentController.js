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
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  blogCreateCommetns,
};
