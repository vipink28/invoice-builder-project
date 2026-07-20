// db/connection.js
// Opens the MongoDB connection using Mongoose.
// Call connectDB() once when the server starts (see server.js).

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in your .env file");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
