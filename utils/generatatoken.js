const jwt = require("jsonwebtoken");

function generateToken(userID, res) {
  const token = jwt.sign({ userID }, process.env.Secret, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, //XSS attacks prevention
    sameSite: "strict", //CSRF attacks prevention
    secure: process.env.NODE_ENV !== "development",
  });
}

module.exports = {
  generateToken,
};
