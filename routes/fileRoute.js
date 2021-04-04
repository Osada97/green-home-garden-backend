const express = require("express");
const { imageUpload, imagesuplaod } = require("../controllers/imageController");
const { authUser, blogUserRole } = require("../middleware/basicAuth");
const { checkUserBelong } = require("../middleware/userBelong");
const { auth } = require("../middleware/verifyToken");

const router = express.Router();

//uploading blog main image
router.post(
  "/upload/:plantBlogId",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  imageUpload
);

//upload multiple images to main blog and blog Steps
router.post(
  "/uploadimages/:Id/:model",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  checkUserBelong,
  imagesuplaod
);

module.exports = router;
