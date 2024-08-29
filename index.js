const express = require("express");
const dotenv = require("dotenv");
const { dbconnect } = require("./db/db.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const postRoute = require("./routes/post.js");
const notificationRoute = require('./routes/notification.js');
const cookieParser = require("cookie-parser");
const { v2: cloudinary } = require("cloudinary");

dotenv.config();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret, // Click 'View API Keys' above to copy your API secret
});

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.listen(PORT, () => {
  dbconnect();
  console.log("Server started at http://localhost:" + PORT);
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use('/api/notifications', notificationRoute);

app.get("/", (req, res) => {
  res.send("Hello");
});
