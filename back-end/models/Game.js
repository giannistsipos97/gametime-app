// models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  id: { type: Number, required: true }, // External API ID (RAWG/IGDB)
  name: { type: String, required: true },
  thumbnail: { type: String },
  background_image: { type: String },
  metacritic: { type: Number },
  rating: { type: Number },
  playNext: { type: Boolean, default: false },

  // Your progress tracking fields:
  played: { type: Boolean, default: false },
  hoursPlayed: { type: Number, default: 0 },
  platform: { type: String, default: "" },
  completedAt: { type: Date },
});

gameSchema.index({ userId: 1, id: 1 }, { unique: true });

const Game = mongoose.model("Game", gameSchema);
export default Game;
