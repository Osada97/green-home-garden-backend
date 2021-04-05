const BlogSteps = require("../models/BlogSteps");
const PlantBlog = require("../models/PlantBlog");
const { blogStepsvalidation } = require("../validaton");

const blogStepsCreate = async (req, res) => {
  //validate blogstep
  const { error } = blogStepsvalidation(req.body);
  //checking the error
  if (error) return res.status(400).send(error.details[0].message);
  const step = new BlogSteps({
    parent_blog: req.body.parent_blog,
    step_title: req.body.step_title,
    after_time: req.body.after_time,
    description: req.body.description,
  });

  await step
    .save()
    .then(async (result) => {
      await PlantBlog.findByIdAndUpdate(
        result.parent_blog,
        { $push: { steps: result._id } },
        { useFindAndModify: false }
      )
        .then(async (resul) => {
          res.json({
            message: "Blog step added",
            blog_body: result,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

//blog step edit
const blogStepEdit = async (req, res) => {
  const stepId = req.params.Id;

  const { error } = blogStepsvalidation(req.body);

  //check if there is an error
  if (error) return res.status(401).json(error.details[0].message);

  await BlogSteps.findByIdAndUpdate(
    stepId,
    {
      $set: {
        parent_blog: req.body.parent_blog,
        step_title: req.body.step_title,
        after_time: req.body.after_time,
        description: req.body.description,
      },
    },
    { new: true, useFindAndModify: true },
    function (err, result) {
      if (err) {
        res.status(401).json({ message: "Please Check Step Id" });
      } else {
        res.json({ message: "Step is Updated", body: result });
      }
    }
  );
};

//get Blog steps
const getBlogByid = async (req, res) => {
  const blogId = req.params.Id;
  await BlogSteps.find({ parent_blog: blogId }, function (err, result) {
    if (err) {
      res.status(400).send(err);
    } else if (!result) {
      res, status(400).json({ message: "This blog id does not match" });
    } else {
      res.json({ body: result });
    }
  });
};

//blog step delete
const delBlogSteps = async (req, res) => {
  const stepId = req.params.Id;
  const parentId = req.ParentId;

  //finding parent
  await PlantBlog.findByIdAndUpdate(
    parentId,
    {
      $pull: {
        steps: stepId,
      },
    },
    { new: true, useFindAndModify: true },
    async function (err, result) {
      if (err) {
        res.send(err);
      } else {
        //deleting step
        await BlogSteps.findOneAndRemove(
          { _id: stepId },
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              res.json({ message: "Step Delete sucsessfully" });
            }
          }
        );
      }
    }
  );
};

module.exports = {
  blogStepsCreate,
  blogStepEdit,
  getBlogByid,
  delBlogSteps,
};
