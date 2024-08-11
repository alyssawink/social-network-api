const mongoose = require("mongoose");
const { User, Thought } = require("../models");
require("dotenv").config();

const mongoURI = "mongodb://127.0.0.1:27017/social-network-api-DB";

const seedDatabase = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Thought.deleteMany({});

    const users = await User.insertMany([
      { username: "Test 1", email: "test1@example.com", isActive: true },
      { username: "Test 2", email: "test2@example.com", isActive: true },
      { username: "Test 3", email: "test3@example.com", isActive: false },
      { username: "Test 4", email: "test4@example.com", isActive: true },
    ]);

    console.log("Users created:", users);

    const thoughts = await Thought.insertMany([
      {
        thoughtText: "This is a thought from Test 1",
        username: "Test 1",
        reactions: [
          { reactionBody: "Great thought!", username: "Test 2" },
          { reactionBody: "I agree!", username: "Test 4" },
        ],
      },
      {
        thoughtText: "Another thought from Test 1",
        username: "Test 1",
        reactions: [{ reactionBody: "Nice!", username: "Test 2" }],
      },
      {
        thoughtText: "Thought from Test 2",
        username: "Test 2",
        reactions: [
          { reactionBody: "Interesting perspective.", username: "Test 1" },
        ],
      },
    ]);

    console.log("Thoughts created:", thoughts);

    await User.findOneAndUpdate(
      { username: "Test 1" },
      { $push: { thoughts: { $each: [thoughts[0]._id, thoughts[1]._id] } } }
    );

    await User.findOneAndUpdate(
      { username: "Test 2" },
      { $push: { thoughts: thoughts[2]._id } }
    );

    console.log("Thoughts assigned to users");

    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();


