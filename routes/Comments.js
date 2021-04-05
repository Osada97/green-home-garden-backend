const express = require("express");
const { blogCreateCommetns } = require("../controllers/commentController");
const { authUser } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");
const BlogComments = require("../models/BlogComments");
const PlantBlog = require("../models/PlantBlog");

const router = express.Router();

//added comments to blog
router.post("/addcomment/:blogId", auth, authUser, blogCreateCommetns);

module.exports = router;
