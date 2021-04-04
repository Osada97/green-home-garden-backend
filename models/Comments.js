const mongoose = require("mongoose");

//comments model this model is related to the both plant blog model and pant steps
const comments = mongoose.Schema({
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
  reply_comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
});

module.exports = mongoose.model("Comments", comments);
