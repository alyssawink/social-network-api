const router = require("express").Router();
const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, username, ...thoughtData } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is not active" });
    }

    if (username !== user.username) {
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    const thought = await Thought.create({ ...thoughtData, username });

    await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    res.status(201).json({ message: "Thought created successfully" });
  } catch (err) {
    console.error("Error creating thought:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:thoughtId", async (req, res) => {
  try {
    const { userId, username, thoughtText } = req.body;
    const { thoughtId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.username !== username) {
      console.log("Username does not match for userId:", userId);
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    console.error("Error updating thought:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    await User.updateMany(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } }
    );

    res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const { userId, username, ...reactionData } = req.body;

    console.log("Received userId:", userId);
    console.log("Received username:", username);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      console.log("User is not active for userId:", userId);
      return res.status(403).json({ message: "User is not active" });
    }

    if (user.username !== username) {
      console.log("Username does not match for userId:", userId);
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: { ...reactionData, username } } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (err) {
    console.error("Error adding reaction:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    const reaction = thought.reactions.id(req.params.reactionId);

    if (!reaction) {
      return res
        .status(404)
        .json({ message: "Invalid thought_id or reaction_id" });
    }

    await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Reaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;