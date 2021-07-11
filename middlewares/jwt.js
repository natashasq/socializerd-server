const jwt = require("jsonwebtoken");
const config = require("../config/auth");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies["token"];
  console.log(token, "token iz jwt middleware")

  if (!token) {
    return res.status(400).send({ message: "No token provided" });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    req.user_id = decoded.id;
  });

  return next();
};
