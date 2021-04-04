const express = require("express");
const {
  blogCretion,
  blogEdit,
  getUserSblog,
  getBlogNsteps,
  removeBlog,
} = require("../controllers/blogController");
const { authUser, blogUserRole } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");
const {
  blogStepsCreate,
  blogStepEdit,
  getBlogByid,
  delBlogSteps,
} = require("../controllers/blogStepsController");
const {
  userSblog,
  ckParentBlog,
  ckStepUser,
} = require("../middleware/userBelong");

const router = express.Router();

//blog creating
router.post("/create", auth, authUser, blogUserRole("BLOG_USER"), blogCretion);

//edit blog
router.put(
  "/editblog/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  userSblog,
  blogEdit
);

//find all blog that user created
router.get("/", auth, authUser, blogUserRole("BLOG_USER"), getUserSblog);

//find one blog and steps that user created
router.get(
  "/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  userSblog,
  getBlogNsteps
);

//remove blog
router.delete(
  "/delete/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  userSblog,
  removeBlog
);

//!!blog steps area
//blog steps create
router.post(
  "/createstep",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  ckParentBlog,
  blogStepsCreate
);

//blog steps edit
router.put(
  "/editstep/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  ckStepUser,
  blogStepEdit
);

//getting blog relared steps
router.get(
  "/findsteps/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  getBlogByid
);

//blog steps delete
router.delete(
  "/delblogstep/:Id",
  auth,
  authUser,
  blogUserRole("BLOG_USER"),
  ckStepUser,
  delBlogSteps
);

module.exports = router;
