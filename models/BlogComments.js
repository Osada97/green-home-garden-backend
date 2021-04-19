const mongoose = require("mongoose");

//comments model this model is related to the both plant blog model and pant steps
const comments = mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlantBlog",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    max: 100,
  },
  body: {
    type: String,
    required: true,
    max: 255,
  },
  pic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  reply_comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReplyComments",
    },
  ],
});

module.exports = mongoose.model("Comments", comments);
