const multer = require("multer");
const path = require("path");
const BlogComments = require("../models/BlogComments");
const ReplyComment = require("../models/ReplyComment");
const StepComments = require("../models/StepComments");

//set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/images/commentspics",
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
}).single("cmtPic");

//check file type
function checkFileType(file, cb) {
  //allowd ext
  const fileTypes = /jpeg|jpg|png/;
  //chel ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //chek mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only Images are Allowed"));
  }
}

//image upload blog comment
const uploadCmtImage = (req, res) => {
  const cmtId = req.params.cid;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(401).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        return res.status(401).json({ message: "Not Image Selected" });
      } else {
        await BlogComments.findByIdAndUpdate(
          cmtId,
          {
            $set: { pic: req.file.destination + "/" + req.file.filename },
          },
          { useFindAndModify: true, new: true },
          function (err, result) {
            if (err) {
              return res.status(401).send(err);
            }
            if (!result) {
              return res.json({ message: "Comment Id Invalid" });
            } else {
              return res.json({
                message: "File Uploaded Successfully",
                result,
              });
            }
          }
        );
      }
    }

    return res.json({ message: "File Uploaded" });
  });
};

//blog step image upload
const uploadSteCmtImage = (req, res) => {
  const cmtId = req.params.cid;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(401).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        return res.status(401).json({ message: "Not Image Selected" });
      } else {
        await StepComments.findByIdAndUpdate(
          cmtId,
          {
            $set: { pic: req.file.destination + "/" + req.file.filename },
          },
          { useFindAndModify: true, new: true },
          function (err, result) {
            if (err) {
              return res.status(401).send(err);
            }
            if (!result) {
              return res.json({ message: "Comment Id Invalid" });
            } else {
              return res.json({
                message: "File Uploaded Successfully",
                result,
              });
            }
          }
        );
      }
    }

    return res.json({ message: "File Uploaded" });
  });
};

//upload reply comment picture
const uploadRpCmtImage = (req, res) => {
  const cmtId = req.params.cid;
  upload(req, res, async (err) => {
    if (err) {
      return res.status(401).json({ message: err.message });
    } else {
      if (req.file == undefined) {
        return res.status(401).json({ message: "Not Image Selected" });
      } else {
        await ReplyComment.findByIdAndUpdate(
          cmtId,
          {
            $set: { pic: req.file.destination + "/" + req.file.filename },
          },
          { useFindAndModify: true, new: true },
          function (err, result) {
            if (err) {
              return res.status(401).send(err);
            }
            if (!result) {
              return res.json({ message: "Comment Id Invalid" });
            } else {
              return res.json({
                message: "File Uploaded Successfully",
                result,
              });
            }
          }
        );
      }
    }

    return res.json({ message: "File Uploaded" });
  });
};

module.exports = {
  uploadCmtImage,
  uploadSteCmtImage,
  uploadRpCmtImage,
};
