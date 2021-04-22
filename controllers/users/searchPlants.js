const pagination = require("../../pagination");
const PlantBlog = require("../../models/PlantBlog");

//get plants using form filling
const getPlants = (req, res) => {
  let width = req.body.width;
  let height = req.body.height;
  let length = req.body.length;
  const plantEnvType = req.body.plant_env_type;
  const whetherType = req.body.whether_type;
  const plantType = req.body.plant_type;
  const category = req.body.category;
  //query string parameters
  const search = req.query.search;
  const page = req.query.page;

  //finding best matches
  if (height == 0 && width == 0 && length == 0) {
    PlantBlog.find(
      {
        plantEnv_type: plantEnvType,
        whether_type: whetherType,
        plant_type: plantType,
        category: category,
        blog_title: { $regex: ".*" + search + ".*" },
      },
      function (err, result) {
        if (err) {
          return res.status(401).send(err);
        }
        if (result.length == 0) {
          return res.json({ message: "No Plants Can Find" });
        }
        return res.send(pagination(result, page));
      }
    );
  } else {
    const volume =
      (width == 0 ? (width = 1) : width) *
      (height == 0 ? (height = 1) : height) *
      (length == 0 ? (length = 1) : length);

    PlantBlog.find(
      {
        volume: { $lte: volume },
        height: { $lte: height },
        width: { $lte: width },
        length: { $lte: length },
        plantEnv_type: plantEnvType,
        whether_type: whetherType,
        plant_type: plantType,
        category: category,
        blog_title: { $regex: ".*" + search + ".*" },
      },
      function (err, result) {
        if (err) {
          return res.status(401).send(err);
        }

        if (result.length == 0) {
          return res.json({ message: "No Plants Can Find" });
        }
        return res.send(pagination(result, page));
      }
    );
  }
};

module.exports = { getPlants };
