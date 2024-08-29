const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); //1 means failure and 0 means success
  }
};

module.exports = {
  dbconnect,
};
