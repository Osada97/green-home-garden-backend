const express = require("express");
const {
  blogCreateCommetns,
  editComment,
  deleteComments,
  deleteBlogcomment,
  getAllBlog,
  addStepComments,
  editStepComment,
  stepsDelete,
  deleteuserStepsComment,
  getStepComment,
} = require("../controllers/commentController");
const { authUser, blogUserRole } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");
const { userSblog, ckStepUser } = require("../middleware/userBelong");
const {
  cmtUserAuth,
  usersBlogComment,
  stepcmtUserAuth,
  authParentBlogStep,
} = require("../middleware/commentAuth");
const {
  uploadCmtImage,
  uploadSteCmtImage,
} = require("../controllers/cmtImageController");

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

//uploading comments picture
router.post("/uploadcmtpic/:cid", auth, authUser, uploadCmtImage);

/*blog steps comment routes*/
//add steps comments
router.post("/stepcmtadd/:Id", auth, authUser, ckStepUser, addStepComments);

//blog steps edit
router.put(
  "/stepscmtedit/:Id",
  auth,
  authUser,
  stepcmtUserAuth,
  editStepComment
);

//user added blog steps delete
router.delete(
  "/stepscmtdelete/:Id",
  auth,
  authUser,
  stepcmtUserAuth,
  stepsDelete
);

//delete blog steps
router.delete(
  "/stepuserdelete/:Id",
  auth,
  authUser,
  authParentBlogStep,
  deleteuserStepsComment
);

//get all blog steps comment
router.get("/getallstepcomment/:sid", auth, authUser, getStepComment);

//upload step comment image upload
router.post("/uploadstcmtpic/:cid", auth, authUser, uploadSteCmtImage);

module.exports = router;
