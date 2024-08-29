const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generatatoken.js");

async function signUpHandler(req, res) {
  const { username, email, fullname, password } = req.body;

  const alreadyExist = await User.findOne({ $or: [{ email }, { username }] });

  if (alreadyExist) {
    return res
      .status(400)
      .json({ success: false, error: "Email or Username Already Exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createUser = {
    username,
    email,
    fullname,
    password: hashedPassword,
  };

  try {
    await User.create(createUser);
    token = generateToken(createUser._id, res);
    return res
      .status(201)
      .json({ success: true, data: email, username, fullname, token });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function signInHandler(req, res) {
  const { username, email, password } = req.body;

  const loginEmail = await User.findOne({ $or: [{ username }, { email }] });
  const result = await bcrypt.compare(password, loginEmail?.password || "");

  if (!loginEmail || !result) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid Email or password" });
  }
  generateToken(loginEmail._id, res);
  return res.status(200).json({ success: true });
}

async function logoutHandler(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ succes: true, message: "logged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server getme Error" });
  }
}

module.exports = {
  signUpHandler,
  signInHandler,
  logoutHandler,
  getMe,
};
