import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    thumbnailImage: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Demo URL must be a valid URL",
      },
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "GitHub URL must be a valid URL",
      },
    },
    category: {
      type: String,
      enum: ["web", "mobile", "desktop", "ai/ml", "other"],
      default: "web",
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk pencarian
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ category: 1 });
projectSchema.index({ featured: -1, order: 1 });

export default mongoose.model("Project", projectSchema);
