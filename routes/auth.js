const { Router } = require("express");
const {
  signUpHandler,
  signInHandler,
  logoutHandler,
  getMe,
} = require("../controllers/auth.js");
const { verifyToken } = require("../middlewares/verifytoken.js");

const router = Router();

router.post("/signup", signUpHandler);
router.post("/login", signInHandler);
router.post("/logout", logoutHandler);
router.get("/getme", verifyToken, getMe);

module.exports = router;
