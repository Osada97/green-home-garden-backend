const { date } = require("joi");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    min: 4,
    max: 100,
  },
  last_name: {
    type: String,
    required: true,
    min: 4,
    max: 100,
  },
  user_name: {
    type: String,
    required: true,
    max: 10,
  },
  pro_pic: {
    type: String,
    max: 1024,
    default: "default.png",
  },
  email: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 1024,
  },
  role: {
    type: String,
    default: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantBlog",
    },
  ],
  addedPlants: [
    {
      _id: false,
      plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlantBlog",
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
