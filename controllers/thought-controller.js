const { User, Thought } = require("../models");

module.exports = {
  getThought(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error retrieving thoughts", error: err })
      );
  },

  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Thought not found with the provided ID" })
          : res.json(thought)
      )
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error retrieving thought", error: err })
      );
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : res.json({
              message: "Thought successfully created and linked to user",
            })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error creating thought", error: err })
      );
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Thought not found with the provided ID" })
          : res.json({ message: "Thought successfully updated", thought })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error updating thought", error: err })
      );
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Thought not found with the provided ID" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message:
                "Thought deleted, but no user found with the provided ID",
            })
          : res.json({
              message: "Thought successfully deleted and unlinked from user",
            })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error deleting thought", error: err })
      );
  },

  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Thought not found with the provided ID" })
          : res.json({
              message: "Reaction successfully added to thought",
              thought,
            })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error adding reaction to thought", error: err })
      );
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "Thought not found with the provided ID" })
          : res.json({
              message: "Reaction successfully removed from thought",
              thought,
            })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error removing reaction from thought", error: err })
      );
  },
};