const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["follow", "like", "comment"],
  },
  read: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
