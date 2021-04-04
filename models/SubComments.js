const mongoose = require("mongoose");

//reply comments this module is related to the parent comment
const replyComments = mongoose.Schema({
  parent_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
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
});

module.exports = mongoose.model("ReplyComments", replyComments);
