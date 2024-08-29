const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const Notification = require("../models/notification.model.js");
const { v2: cloudinary } = require("cloudinary");

async function createPostHandler(req, res) {
  const { text, img } = req.body;
  try {
    const userID = req.user._id;
    const user = await User.findOne(userID);

    if (!user) {
      return res.status(404).json({ error: "User Not found" });
    }
    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Atleast image or Text is required" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      createdBy: userID,
      text,
      img,
    });

    await newPost.save();
    return res.status(201).json({ message: newPost });
  } catch (error) {
    console.log("error in createposthandler");
    return res.status(500).json({ error: error.message });
  }
}

async function deletePostHandler(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!id) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("error in deletpost");
    return res.status(500).json({ error: error.message });
  }
}

async function commentPostHandler(req, res) {
  const { id } = req.params;
  const userID = req.user._id;
  const { text } = req.body;

  const post = await Post.findById(id);
  const posterID = post.createdBy;
  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }

  const newNotification = new Notification({
    from: userID,
    to: posterID,
    type: "comment",
  });

  await newNotification.save();

  post.comments.push({ text: text, by: userID });

  await post.save();
  return res
    .status(200)
    .json({ notification: newNotification, comments: text });
}

async function likeUnlikePostHandler(req, res) {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userID = req.user._id;
    const posterID = post.createdBy;

    const userLikedPosts = post.likes.includes(userID);

    if (userLikedPosts) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: userID } });
      await User.findByIdAndUpdate(userID, { $pull: { likedPosts: id } });
      return res.status(200).json({ message: "Unliked sucessfully" });
    }
    const likepost = await Post.findByIdAndUpdate(id, {
      $push: { likes: userID },
    });
    if (userID.toString() === posterID.toString()) {
      const userlikepost = await User.findByIdAndUpdate(userID, {
        $push: { likedPosts: id },
      });
      return res.status(200).json({ likepost, userlikepost });
    } else {
      const userlikepost = await User.findByIdAndUpdate(userID, {
        $push: { likedPosts: id },
      });

      const newNotification = new Notification({
        from: userID,
        to: posterID,
        type: "like",
      });
      return res.status(200).json({ newNotification, likepost, userlikepost });
    }
  } catch (error) {
    console.log("error in likeunlike");
    return res.status(500).json({ error: error.message });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "comments.by", select: "-password" });
    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error in get all post");
    return res.status(500).json({ error: error.message });
  }
}

async function getFollowingPosts(req, res) {
  try {
    const userID = req.user._id;

    const user = await User.findById(userID);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const following = user.following;
    const feedPosts = await Post.find({ createdBy: { $in:  following } } )
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", select: "-password" })
      .populate({ path: "comments.by", select: "-password" });

    return res.status(200).json({ feedPosts });
  } catch (error) {
    console.log("Error in Getfollowing posts");
    return res.status(500).json({ error: error.message });
  }
}

async function getUserPosts(req, res){
    try {
        const userID = req.user._id;

        const user = await User.findById(userID);

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        const posts = await Post.find({createdBy: userID}).sort({createdAt: -1}).populate({path: "createdBy", select: "-password"}).populate({path: "comments.by", select:"-password"});

        return res.status(200).json({posts});


    } catch (error) {
        console.log("Error in get user posts");
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
  createPostHandler,
  deletePostHandler,
  commentPostHandler,
  likeUnlikePostHandler,
  getAllPosts,
  getFollowingPosts,
  getUserPosts
};
