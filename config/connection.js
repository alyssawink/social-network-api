const { connect, connection } = require("mongoose");
require("dotenv").config();

const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social-network-api-DB";

connect(connectionString)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

module.exports = connection;