import mongoose from "mongoose"

const usageSchema = new mongoose.Schema({

  clerkId: {
    type: String,
    unique: true,
    required: true
  },

  dailyMessageCount: {
    type: Number,
    default: 0
  },

  dailyMessageLimit: {
    type: Number,
    default: 20
  },

  messageResetAt: {
    type: Date,
    default: () =>
      Date.now() + 24 * 60 * 60 * 1000
  }

}, {
  timestamps: true
})

export default mongoose.model(
  "Usage",
  usageSchema
)