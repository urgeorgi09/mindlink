// models/Journal.js
import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema({
  userId: {
    type: String,  // ✅ String за UUID
    required: true,
    index: true
  },
  promptEnc: {
    type: String,  // ✅ Криптиран prompt
    default: null
  },
  textEnc: {
    type: String,  // ✅ Криптирано съдържание
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: { 
    type: Boolean, 
    default: true 
  },
  wordCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Index за бързо търсене
JournalSchema.index({ userId: 1, createdAt: -1 });

const Journal = mongoose.model("Journal", JournalSchema);

export default Journal;