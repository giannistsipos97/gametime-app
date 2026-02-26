// routes/library.js
// const express = require("express");
import express from "express"; // Change require to import
import Game from "../models/Game.js"; // Ensure .js extension is here
import auth from "../middleware/authMiddleware.js";

const router = express.Router();
// 1. Get all games for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user.id });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. Add a game to library
router.post("/", auth, async (req, res) => {
  try {
    // 1. Log the body to make sure Angular sent the data
    console.log("Adding game for user:", req.user.id);
    console.log("Game data:", req.body);

    // 2. Create the game object (Ensure you aren't using 'newUser' here!)
    const newGame = new Game({
      ...req.body, // Spread the title, thumbnail, id from Angular
      userId: req.user.id, // Use the ID from the decoded token
    });

    // 3. Save to MongoDB
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message }); // This sends the error back to Angular
  }
});

// Change from router.put('/:id') to a more flexible update
// routes/library.js

// We use :rawgId because we always have that, even before saving to DB
router.put("/sync/:rawgId", auth, async (req, res) => {
  try {
    const { rawgId } = req.params;
    const updateData = req.body;

    // The Magic: findOneAndUpdate
    // Filter: find by this RAWG ID and this specific User
    // Update: set the new data
    // Options:
    //   upsert: true -> Create it if it doesn't exist
    //   new: true    -> Return the updated version
    const game = await Game.findOneAndUpdate(
      { id: rawgId, userId: req.user.id },
      { $set: updateData }, // updateData now contains the nulls
      { upsert: true, new: true },
    );

    res.json(game);
  } catch (err) {
    console.error("Upsert Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// 3. Remove a game
router.delete("/:id", auth, async (req, res) => {
  try {
    await Game.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Game removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

router.patch("/:id/play-next", auth, async (req, res) => {
  try {
    const game = await Game.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!game) return res.status(404).json({ message: "Game not found" });

    game.playNext = !game.playNext;
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
