const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const blogCrud = require("./routes/blogCrud");
const fileRoute = require("./routes/fileRoute");
const comments = require("./routes/comments");
const replycmt = require("./routes/replyCommentsR");
require("dotenv/config");

const app = express();

//Middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/blog", blogCrud);
app.use("/image", fileRoute);
app.use("/comment", comments);
app.use("/replycmt", replycmt);

//static files
app.use("/img", express.static("uploads/images"));

//connect to the database
mongoose
  .connect(process.env.DB_URL, { useUnifiedTopology: true })
  .then((result) => {
    console.log("conected to the database");
    //server listening
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
