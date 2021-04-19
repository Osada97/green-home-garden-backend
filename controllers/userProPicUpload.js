const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: "./uploads/image/userpropic",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("proPic");

//checking file type
const checkFileType = (file, cb) => {
  //allowed extensions
  const fileTypes = /jpg|jpeg|png/;
  //check file type
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only Images Are Allowed"));
  }
};

const userProPicUpload = (req, res) => {
  const userId = req.params.Id;

  upload(req, res, async (err) => {
    if (err) {
      res.status(401).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        return res.status(401).json({ message: "Image Not Selected" });
      } else {
        await User.findByIdAndUpdate(
          userId,
          {
            $set: { pro_pic: req.file.destination + "/" + req.file.filename },
          },
          { useFindAndModify: true, new: true },
          function (err, result) {
            if (err) {
              return res.status(401).send(err);
            }
            if (!result) {
              return res.status(401).json({ message: "User Id Invalid" });
            } else {
              return res.json({
                message: "User Profile Picture Uploaded Successfully",
                result,
              });
            }
          }
        );
      }
    }
  });
};

module.exports.propicupload = userProPicUpload;
