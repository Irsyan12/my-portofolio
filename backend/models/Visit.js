import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
      trim: true,
    },
    referrer: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
      default: "",
    },
    os: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    isUnique: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk analytics
visitSchema.index({ createdAt: 1 });
visitSchema.index({ page: 1, createdAt: -1 });
visitSchema.index({ ipAddress: 1, createdAt: -1 });
visitSchema.index({ country: 1 });
visitSchema.index({ device: 1 });

export default mongoose.model("Visit", visitSchema);
