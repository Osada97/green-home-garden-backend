const express = require("express");
const {
  addReplyCmt,
  editReplyComment,
} = require("../controllers/replyCmtController");
const { authUser } = require("../middleware/basicAuth");
const { authReplyCmt } = require("../middleware/commentAuth");
const { auth } = require("../middleware/verifyToken");

const router = express.Router();

//adding reply comments to blog post
router.post("/addcmt/:Id/:mtype", auth, authUser, addReplyCmt);

//edit reply comment
router.put("/editcmt/:Id", auth, authUser, authReplyCmt, editReplyComment);

//delete reply comment that user added

//delete reply comment that blog user created

//get all comments with reply comments

module.exports = router;
