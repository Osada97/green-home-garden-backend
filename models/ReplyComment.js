const mongoose = require("mongoose");

//comments model this model is related to the both plant blog model and pant steps
const replyComments = mongoose.Schema({
  ParentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
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
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("ReplyComments", replyComments);
