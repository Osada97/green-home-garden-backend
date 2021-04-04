const authUser = (req, res, next) => {
  if (req.user == null) {
    return res.status(403).send("Please Sign In");
  }
  next();
};

const blogUserRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(401).send("User Not Allowed");
    }

    next();
  };
};

module.exports = {
  authUser,
  blogUserRole,
};
