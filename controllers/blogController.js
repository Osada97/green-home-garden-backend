const BlogSteps = require("../models/BlogSteps");
const PlantBlog = require("../models/PlantBlog");
const User = require("../models/User");
const { iniitialBlogValidation } = require("../validaton");

const blogCretion = async (req, res) => {
  const user = req.user;

  //validate form
  const { error } = iniitialBlogValidation(req.body);
  //cheking error occured or not
  if (error) return res.status(400).send(error.details[0].message);

  const plantBlog = new PlantBlog({
    author_id: user._id,
    blog_title: req.body.blog_title,
    category: req.body.category,
    plantEnv_type: req.body.plant_env_type,
    plant_type: req.body.plant_type,
    whether_type: req.body.whether_type,
    width: req.body.width,
    length: req.body.length,
    height: req.body.height,
    volume: req.body.width * req.body.height * req.body.height,
    description: req.body.description,
  });
  await plantBlog.save().then(async (result) => {
    res.send(result);
    const updateUserPost = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { post: result._id },
      },
      { useFindAndModify: false }
    );
  });
};

//editing blog
const blogEdit = async (req, res) => {
  const blogId = req.params.Id;

  const { error } = iniitialBlogValidation(req.body);

  if (error) return res.status(401).send(error.details[0].message);

  await PlantBlog.findByIdAndUpdate(
    blogId,
    {
      $set: {
        blog_title: req.body.blog_title,
        category: req.body.category,
        plantEnv_type: req.body.plant_env_type,
        plant_type: req.body.plant_type,
        width: req.body.width,
        length: req.body.length,
        height: req.body.height,
        volume: req.body.width * req.body.length * req.body.height,
        description: req.body.description,
      },
    },
    { new: true, useFindAndModify: false },
    function (err, result) {
      if (err) {
        res.status(400).json({ message: "Blog id is invalied" });
      } else {
        res.send(result);
      }
    }
  );
};

//get all blog user created
const getUserSblog = async (req, res) => {
  await PlantBlog.find({ author_id: req.user._id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).json({ message: "Author id is Invalied please check" });
    });
};

//get one blog and steps that user created
const getBlogNsteps = async (req, res) => {
  const blogId = req.params.Id;

  await PlantBlog.findById(blogId)
    .populate("steps")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(400).json({ message: "Blog id is invalied Please Check" });
    });
};

//remove blog
const removeBlog = async (req, res) => {
  const blogid = req.params.Id;
  await PlantBlog.findById(blogid)
    .then(async (result) => {
      if (result) {
        await PlantBlog.deleteOne({ _id: blogid })
          .then(async () => {
            await BlogSteps.deleteMany({ parent_blog: result._id })
              .then((results) => {
                res.json({
                  message: "Remove Blog " + result._id,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(400).json({
          message: "Blog Id not Available",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  blogCretion,
  blogEdit,
  getUserSblog,
  getBlogNsteps,
  removeBlog,
};
