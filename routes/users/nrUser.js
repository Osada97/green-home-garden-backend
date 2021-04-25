const express = require("express");
const {
  addPlantsUser,
  browsePlants,
  browsePlantslogin,
  browsePlantByCategory,
} = require("../../controllers/users/plantBlogController");
const { getPlants } = require("../../controllers/users/searchPlants");
const { authUser } = require("../../middleware/basicAuth");
const { auth } = require("../../middleware/verifyToken");

const router = express.Router();

//browse plant using form
router.post("/findplant", getPlants);

//browse all plants
router.get("/browseplant", browsePlants);

//browse plants by category
router.get("/browseplantbycat", browsePlantByCategory);

//browse all plants after login
router.get("/browseplantlog", auth, authUser, browsePlantslogin);

//router.get("/browseplantbcate")

//added plants to the user
router.post("/addplant/:Id", auth, authUser, addPlantsUser);

module.exports = router;
