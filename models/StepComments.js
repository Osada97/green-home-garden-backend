const mongoose = require("mongoose");

//reply comment model
const Stepcomments = mongoose.Schema({
  stepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogSteps",
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

module.exports = mongoose.model("StepComments", Stepcomments);
