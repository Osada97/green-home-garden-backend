const multer = require("multer");
const path = require("path");
const BlogSteps = require("../models/BlogSteps");
const PlantBlog = require("../models/PlantBlog");

//storage engine
function uploadStorage(uploadFilePath) {
  return (storage = multer.diskStorage({
    destination: uploadFilePath,
    filename: (req, file, cb) => {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  }));
}

//single images upload
const upload = multer({
  storage: uploadStorage("./uploads/images/blogMainImage"),
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("blogPhotos");

//multiple images upload
const Mupload = multer({
  storage: uploadStorage("./uploads/images/blogNstepSampleImages"),
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).array("blogSamPhotos");

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

//image upload
const imageUpload = async (req, res) => {
  const blogId = req.params.plantBlogId;

  upload(req, res, async (err) => {
    if (err) {
      res.status(401).json({
        message: err.message,
      });
    } else {
      if (req.file == undefined) {
        res.status(400).json({
          message: "No file selected",
        });
      } else {
        //add filename and file url to the blogPost module
        await PlantBlog.findByIdAndUpdate(
          { _id: blogId },
          {
            $set: { plant_image: req.file.filename },
          },
          { new: true, useFindAndModify: false },
          function (err, model) {
            if (!model) {
              return res.status(400).send("Id Is not Found");
            } else {
              return model;
            }
          }
        )
          .then((result) => {
            res.json({
              message:
                "File Uploaded and  Added New Image To Blog " + result._id,
              body: result.plant_image,
              file: `${process.env.MAIN_URL}/img/blogMainImage/${req.file.filename}`,
            });
          })
          .catch((err) => {
            res.status(401).send(err);
          });
      }
    }
  });
};

//uploading multiple images to the main blog and blog steps
const imagesuplaod = (req, res) => {
  const blogId = req.params.Id;
  const model = req.params.model;

  Mupload(req, res, async (err) => {
    if (err) {
      res.status(401).json({
        message: err.message,
      });
    } else {
      if (req.files == undefined) {
        res.status(400).json({
          message: "No file selected",
        });
      } else {
        //checking the model name that want to upload
        if (model == "blog") {
          if (req.files.length <= 5) {
            //add filename and file url to the blogPost module
            PlantBlog.findByIdAndUpdate(
              { _id: blogId },
              {
                $push: { samp_images: { $each: newArray(req) } },
              },
              { upsert: true, new: true, useFindAndModify: false },

              function (err, model) {
                if (!model) {
                  res.status(400).send("Id Is not Found");
                }
                if (err) {
                  res.status(401).send(err);
                } else {
                  const imgArry = [];
                  model.samp_images.map((img) => {
                    imgArry.push(
                      `${process.env.MAIN_URL}/img/blogSampleImages/${img}`
                    );
                  });
                  res.json({
                    message:
                      "File Uploaded and  Added New Image To Blogs " +
                      model._id,
                    body: model.plant_image,
                    file: imgArry,
                  });
                }
              }
            );
          } else {
            res.status(400).json({ message: "File count must be less than 5" });
          }
        } else if (model == "step") {
          if (req.files.length <= 5) {
            //add filename and file url to the blogPost module
            BlogSteps.findByIdAndUpdate(
              { _id: blogId },
              {
                $push: { samp_images: { $each: newArray(req) } },
              },
              { upsert: true, new: true, useFindAndModify: false },

              function (err, model) {
                if (!model) {
                  res.status(400).send("Id Is not Found");
                }
                if (err) {
                  res.status(401).send(err);
                } else {
                  const imgArry = [];
                  model.samp_images.map((img) => {
                    imgArry.push(
                      `${process.env.MAIN_URL}/img/blogSampleImages/${img}`
                    );
                  });
                  res.json({
                    message:
                      "File Uploaded and  Added New Image To Blog steps " +
                      model._id,
                    body: model.plant_image,
                    file: imgArry,
                  });
                }
              }
            );
          } else {
            res.status(400).json({ message: "File count must be less than 5" });
          }
        }
      }
    }
  });
};

//functon for add array of values to mongo db
function newArray(data) {
  let arr = [];
  data.files.map((dt) => {
    arr.push(dt.filename);
  });

  return arr;
}

module.exports = {
  imageUpload,
  imagesuplaod,
};
