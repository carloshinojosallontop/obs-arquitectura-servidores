import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/db_posts";

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
});
