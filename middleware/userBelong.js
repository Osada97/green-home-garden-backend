const mongoose = require("mongoose");
const BlogSteps = require("../models/BlogSteps");
const PlantBlog = require("../models/PlantBlog");

//chek blog and step author is belong to step and blog in image
const checkUserBelong = async (req, res, next) => {
  const blogId = req.params.Id;
  const model = req.params.model;
  if (model == "step") {
    await BlogSteps.find(
      {
        _id: blogId,
      },
      function (err, blog) {
        if (err) {
          res.status(401).json({
            message: `This User Dont Have step ${blogId}`,
          });
        } else {
          PlantBlog.find(
            {
              _id: blog[0].parent_blog,
            },
            function (err, blog) {
              if (blog) {
                if (blog.length != 0) {
                  if (blog[0].author_id != req.user._id) {
                    res.status(401).json({
                      message: `This User Dont Have post ${blogId}`,
                    });
                  } else {
                    next();
                  }
                } else {
                  res.status(401).json({
                    message: `This step post dont have parent blog ${blogId}`,
                  });
                }
              } else {
                res.status(401).json({
                  message: `This User Dont Have post ${blogId}`,
                });
              }
            }
          );
        }
      }
    );
  } else if (model == "blog") {
    await PlantBlog.find(
      {
        author_id: req.user._id,
        _id: blogId,
      },
      function (err, blog) {
        if (err) {
          res.status(401).json({
            message: `This User Dont Have ${blogId}`,
          });
        } else {
          next();
        }
      }
    );
  } else {
    res.status(401).json({
      message: `URL link error`,
    });
  }
};

//chek blog author is belong to the blog
const userSblog = async (req, res, next) => {
  const blogId = req.params.Id;

  await PlantBlog.find(
    {
      author_id: req.user._id,
      _id: blogId,
    },
    function (err, blog) {
      if (err) {
        res.status(401).json({
          message: `This User Dont Have ${blogId}`,
        });
      } else {
        next();
      }
    }
  );
};

//checkign parent blog is belong to the loged in user
const ckParentBlog = async (req, res, next) => {
  const parentBlog = req.body.parent_blog;

  await PlantBlog.findById(parentBlog, function (err, result) {
    if (!result) {
      res.status(401).json({
        message: "Parent Blog Id is Invalied " + parentBlog,
      });
    } else {
      // check  blog author id and user id is equal
      if (result.author_id != req.user._id) {
        res.status(401).json({
          message: "Current user dont have this blog id " + parentBlog,
        });
      } else {
        next();
      }
    }
  });
};

//check current user is belong to the blog step
const ckStepUser = async (req, res, next) => {
  const stepId = req.params.Id;

  await BlogSteps.findById(stepId, function (err, result) {
    if (err) {
      res.status(401).json({
        message: "Step Id is Invalied Please Check",
      });
    } else {
      if (result) {
        //chek parent blog author is correct
        const parentAuthor = result.parent_blog.author_id;
        if (parentAuthor != req.user._id) {
          res.status(401).json({
            message: "Blog Author Invalied",
          });
        } else {
          req.ParentId = result.parent_blog._id;
          next();
        }
      } else {
        res.status(401).json({
          message: "Step Id is Invalied Please Check",
        });
      }
    }
  }).populate("parent_blog");
};

module.exports = {
  checkUserBelong,
  userSblog,
  ckParentBlog,
  ckStepUser,
};
