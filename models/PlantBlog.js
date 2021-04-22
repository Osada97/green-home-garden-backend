const mongoose = require("mongoose");

//creating scema of plant blog
const PlantBlogScheme = mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blog_title: {
    type: String,
    required: true,
    max: 255,
  },
  category: {
    type: String,
    required: true,
    max: 200,
  },
  plantEnv_type: {
    type: String,
    required: true,
  },
  whether_type: {
    type: String,
    default: "any",
  },
  plant_type: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    required: true,
    max: 1000,
  },
  plant_image: {
    type: String,
  },
  samp_images: [],
  steps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogSteps",
    },
  ],
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

module.exports = mongoose.model("PlantBlog", PlantBlogScheme);
