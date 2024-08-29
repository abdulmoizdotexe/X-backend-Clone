const { Router } = require("express");
const {
  getProfileHandler,
  followUnfollowHandler,
  getSuggestedUsersHandler,
} = require("../controllers/user.js");
const { verifyToken } = require("../middlewares/verifytoken.js");

const router = Router();

router.get("/profile/:username", verifyToken, getProfileHandler);
router.post("/follow/:id", verifyToken, followUnfollowHandler);
router.get("/suggestedusers", verifyToken, getSuggestedUsersHandler);

module.exports = router;
