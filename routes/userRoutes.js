const express = require("express");
const loginRegisterController = require("../controllers/loginRegisterController");
const { authUser, blogUserRole } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");

const router = express.Router();

//user register
router.post("/register", loginRegisterController.UserRegister);
//user login
router.post("/login", loginRegisterController.UserLogin);

module.exports = router;
