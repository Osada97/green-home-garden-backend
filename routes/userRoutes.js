const express = require("express");
const loginRegisterController = require("../controllers/loginRegisterController");
const { propicupload } = require("../controllers/userProPicUpload");
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

//upload user profile picture
router.post("/uploadpropic/:Id", auth, authUser, propicupload);

module.exports = router;
