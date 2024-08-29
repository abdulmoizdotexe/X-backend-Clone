const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

async function verifyToken(req, res, next) {
  const pass = req.cookies.token;
  if (!pass) {
    res
      .status(401)
      .json({ success: false, error: "Unauthorized: No token Available" });
  }

  const checktoken = jwt.verify(pass, process.env.Secret);

  if (!checktoken) {
    res.status(401).json({ success: false, error: "Token not valid" });
  }

  const user = await User.findById(checktoken.userID).select("-password");
  console.log(user)

  if (!user) {
    res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  next();
}

module.exports = {
  verifyToken,
};
