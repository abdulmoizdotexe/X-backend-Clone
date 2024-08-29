const User = require("../models/user.model.js");
const Notification = require("../models/notification.model.js");
async function getProfileHandler(req, res) {
  const { username } = req.params;

  if (!username) {
    return res.status(401).json({ error: "Username is required" });
  }

  try {
    const profile = await User.findOne({ username }).select("-password");
    if (!profile) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function followUnfollowHandler(req, res) {
  const { id } = req.params;

  try {
    currentUser = await User.findById(req.user._id);
    userTomodify = await User.findById(id);

    if (!currentUser || !userTomodify) {
      return res.status(400).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow urself" });
    }
    if (isFollowing) {
      const modify = await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      const current = await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      return res.status(200).json({
        message: `${current.username} has unfollowed ${modify.username}`,
      });
    } else {
      const modify = await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      const current = await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userTomodify.id,
      });
      await newNotification.save();
      return res.status(200).json({
        message: `${current.username} has followed ${modify.username}`,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getSuggestedUsersHandler(req, res) {
  try {
    const userID = req.user._id;
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userID },
        },
      },
      { $sample: { size: 10 } },
    ]);
    const followedby = await User.findOne(userID).select("following");

    const filteredusers = users.filter(
      (user) => !followedby.following.includes(user._id)
    );
    const suggestedUsers = filteredusers.slice(0, 4);

    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    return res.status(200).json({ suggestedUsers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getProfileHandler,
  followUnfollowHandler,
  getSuggestedUsersHandler,
};
