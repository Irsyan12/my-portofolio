import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk analytics dan display
feedbackSchema.index({ rating: -1, createdAt: -1 });
feedbackSchema.index({ createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);
