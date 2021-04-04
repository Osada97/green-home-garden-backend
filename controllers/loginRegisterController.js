const User = require("../models/User");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../validaton");
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
  if (!loginResult) return res.status(400).send("Email Is Invalied");

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

module.exports = {
  UserRegister,
  UserLogin,
};
