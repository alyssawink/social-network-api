const { Schema, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: [true, "Reaction body is required"],
      maxlength: [280, "Reaction body cannot exceed 280 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;