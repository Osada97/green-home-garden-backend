const express = require("express");
const loginRegisterController = require("../controllers/loginRegisterController");
const { authUser } = require("../middleware/basicAuth");
const { auth } = require("../middleware/verifyToken");

const router = express.Router();

//user register
router.post("/register", loginRegisterController.UserRegister);
//user login
router.post("/login", loginRegisterController.UserLogin);

//user account edit
router.put("/edit", auth, authUser, loginRegisterController.editUser);

//user password change
router.put("/changepw", auth, authUser, loginRegisterController.changePassword);

//get user account details
router.get("/details", auth, authUser, loginRegisterController.userDetails);

module.exports = router;
