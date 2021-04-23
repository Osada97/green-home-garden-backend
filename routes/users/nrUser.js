const express = require("express");
const { getPlants } = require("../../controllers/users/searchPlants");

const router = express.Router();

//browse plant using form
router.post("/findplant", getPlants);

//browse plants

module.exports = router;
