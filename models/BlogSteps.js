const mongoose = require("mongoose");

//creating scema of steps that related to the plant blog
const BlogSteps = mongoose.Schema({
  parent_blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantBlog",
  },
  step_title: {
    type: String,
    required: true,
    max: 255,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  after_time: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    max: 3000,
  },
  samp_images: [],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  status: {
    type: Number,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("BlogSteps", BlogSteps);
