const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  registerValidation,
  loginValidation,
  userDetailsValidation,
  passwordValidation,
} = require("../validaton");
const jwt = require("jsonwebtoken");

const UserRegister = async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);

  //checking error occured or not
  if (error) return res.status(400).send(error.details[0].message);

  //cheking provide email is already insert
  const emailExsits = await User.findOne({ email: req.body.email });
  if (emailExsits)
    return res.status(400).send("Email Address is Already Exsits");

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  //crate new user
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });

  user
    .save()
    .then((result) => {
      res.send({ result, message: "User Registration Successfull" });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

const UserLogin = async (req, res) => {
  //validation
  const { error } = loginValidation(req.body);

  //checking error occured or not
  if (error) return res.status(400).send(error.details[0].message);

  const loginResult = await User.findOne({ email: req.body.email });
  if (!loginResult) return res.status(400).send("Email Is Invalid");

  const validPath = await bcrypt.compare(
    req.body.password,
    loginResult.password
  );
  if (!validPath) return res.status(400).send("Password is Invalid");

  //create and assiign token\
  const token = jwt.sign(
    { _id: loginResult._id, role: loginResult.role },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send({ message: "Login Successfull", token });
};

//edit users details
const editUser = async (req, res) => {
  const id = req.user._id;

  //validate user
  const { error } = userDetailsValidation(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  //checking email is already entered
  const emailExsits = await User.findOne({
    email: req.body.email,
    _id: { $ne: id },
  });
  if (emailExsits)
    return res.status(401).json({ message: "Email Is Already Exsits" });

  await User.findByIdAndUpdate(
    id,
    {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        email: req.body.email,
      },
    },
    { useFindAndModify: true, new: true },
    function (err, result) {
      if (err) {
        return res.status(401).send(err);
      }
      return res.json({ message: "User Details Updated", result });
    }
  );
};

//change password
const changePassword = async (req, res) => {
  const id = req.user._id;

  const { error } = passwordValidation(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  //encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //checking current password is current
  const usedetails = await User.findById(id);
  const validPw = await bcrypt.compare(
    req.body.currentPassword,
    usedetails.password
  );

  if (!validPw)
    return res.status(401).json({ message: "Current Password Is Invalid" });

  User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        password: hashedPassword,
      },
    },
    { useFindAndModify: true, new: true },
    function (err, result) {
      if (err) {
        return res.status(401).send(err);
      }
      if (!result) {
        return res.status(401).json({ message: "Current Password Is Invalid" });
      }

      return res.json({ message: "Password Changed Successfully", result });
    }
  );
};

//get user details
const userDetails = (req, res) => {
  const id = req.user._id;

  User.findById(id, function (err, result) {
    if (err) {
      return res.status(401).send(err);
    }
    return res.send(result);
  });
};

module.exports = {
  UserRegister,
  UserLogin,
  userDetails,
  editUser,
  changePassword,
};
