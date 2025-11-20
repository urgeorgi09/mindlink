import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  prompt: String,
  content: { type: String, required: true },
  tags: [String],
  isPrivate: { type: Boolean, default: true },
  wordCount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Journal = mongoose.model("Journal", JournalSchema);

export default Journal;
