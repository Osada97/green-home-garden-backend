const PlantBlog = require("../../models/PlantBlog");
const User = require("../../models/User");
const pagination = require("../../pagination");

//add plants to the user
const addPlantsUser = async (req, res) => {
  const id = req.params.Id;

  //checking plant id is already added
  await User.find(
    {
      _id: req.user._id,
      addedPlants: id,
    },
    function (err, results) {
      if (err) {
        return res.status(401).send(err);
      }
      if (results.length > 0) {
        return res
          .status(401)
          .json({ message: "Plant Blog Is Already Added To This User" });
      } else {
        //updating user model
        User.findByIdAndUpdate(
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
  const page = req.query.page;

  PlantBlog.find(
    { blog_title: { $regex: ".*" + search + ".*", $options: "i" } },
    function (err, result) {
      if (err) {
        return res.status(401).send(err);
      }

      return res.send(pagination(result, page, availableCategory(result)));
    }
  );
};

//browse plants after login
const browsePlantslogin = async (req, res) => {
  const search = req.query.search;
  const page = req.query.page;

  await PlantBlog.find(
    { blog_title: { $regex: ".*" + search + ".*", $options: "i" } },
    async function (err, result) {
      if (err) {
        return res.status(401).send(err);
      }
      const newResult = await checkAddedBlogs(
        req.user._id,
        pagination(result, page)
      );
      return res.send(newResult);
    }
  ).lean();
};

//browse plant by category

//function for get available category
const availableCategory = (result) => {
  const cresult = [...result];
  const av = [];

  cresult.map((data) => {
    //checking new array has same data
    av.push(data.category);
  });
  const avil = av.filter((value, pos) => {
    return av.indexOf(value) == pos;
  });

  return avil;
};

//function for check added blogs in browse result
function checkAddedBlogs(userid, allPlants = []) {
  return User.findById(userid)
    .select("addedPlants")
    .then((result) => {
      const plantsId = [...result.addedPlants];
      allPlants.results.map((data, index) => {
        if (plantsId.toString().includes(data._id)) {
          Object.assign(allPlants.results[index], { useradded: true });
        }
      });
      return allPlants;
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  addPlantsUser,
  browsePlants,
  browsePlantslogin,
};
