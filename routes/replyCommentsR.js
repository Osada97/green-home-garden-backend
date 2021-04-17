const express = require("express");
const {
  addReplyCmt,
  editReplyComment,
  deleteUserRComment,
  getReplycmt,
} = require("../controllers/replyCmtController");
const { authUser } = require("../middleware/basicAuth");
const {
  authReplyCmt,
  authReplyCmtWUser,
} = require("../middleware/commentAuth");
const { auth } = require("../middleware/verifyToken");
const { blogUserRole } = require("../middleware/basicAuth");

const router = express.Router();

//adding reply comments to blog post
router.post("/addcmt/:Id/:mtype", auth, authUser, addReplyCmt);

//edit reply comment
router.put("/editcmt/:Id", auth, authUser, authReplyCmt, editReplyComment);

//delete reply comment that user added
router.delete("/dltcmt/:Id", auth, authUser, authReplyCmt, deleteUserRComment);

//delete reply comment that blog user created
router.delete(
  "/dltucmt/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  authReplyCmtWUser,
  deleteUserRComment
);

//get one reply comment
router.get("/:Id", auth, authUser, getReplycmt);

module.exports = router;
