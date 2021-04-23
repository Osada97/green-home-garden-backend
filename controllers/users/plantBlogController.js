const PlantBlog = require("../../models/PlantBlog");
const User = require("../../models/User");

//add plants to the user
const addPlantsUser = async (req, res) => {
  const id = req.params.Id;

  //checking plant id is already added
  await User.find(
    {
      _id: req.user._id,
      addedPlants: id,
    },
    async function (err, results) {
      if (err) {
        return res.status(401).send(err);
      }
      if (results.length > 0) {
        return res
          .status(401)
          .json({ message: "Plant Blog Is Already Added To This User" });
      } else {
        //updating user model
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $push: {
              addedPlants: id,
            },
          },
          { useFindAndModify: true, new: true },
          function (err, result) {
            if (err) {
              return res.status(401).send(err);
            }
            if (!result) {
              return res.status(401).json({ message: "User Id Is Invalid" });
            }

            return res.json({ message: "Plant Added", result });
          }
        );
      }
    }
  );
};

//Browse Plants with search and pagination
const browsePlants = (req, res) => {
  const search = req.query.search;

  PlantBlog.find(
    { blog_title: { $regex: ".*" + search + ".*", $options: "i" } },
    function (err, result) {
      if (err) {
        return res.status(401).send(err);
      }

      return res.send(result);
    }
  );
};

module.exports = {
  addPlantsUser,
  browsePlants,
};
