const express = require("express");
const {
  blogCreateCommetns,
  editComment,
  deleteComments,
  deleteBlogcomment,
  getAllBlog,
} = require("../controllers/commentController");
const { authUser, blogUserRole } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");
const { userSblog } = require("../middleware/userBelong");
const { cmtUserAuth, usersBlogComment } = require("../middleware/commentAuth");

const router = express.Router();

//added comments to blog
router.post(
  "/addcomment/:blogId",
  auth,
  authUser,
  userSblog,
  blogCreateCommetns
);

//update comments
router.put("/editcomment/:Id", auth, authUser, cmtUserAuth, editComment);

//delete single comments
router.delete(
  "/deletecomment/:Id",
  auth,
  authUser,
  cmtUserAuth,
  deleteComments
);

//delete single comment that user create blog
router.delete(
  "/deleteblogcomment/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  usersBlogComment,
  deleteBlogcomment
);

//get all comments that belongs to specific blog
router.get("/getcomments/:bId", auth, authUser, getAllBlog);

module.exports = router;
