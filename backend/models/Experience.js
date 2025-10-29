import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: [
      {
        type: String,
        required: true,
      },
    ],
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    achievements: [
      {
        type: String,
      },
    ],
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isCurrentRole: {
      type: Boolean,
      default: false,
    },
    companyLogo: {
      type: String,
      default: "",
    },
    companyWebsite: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Company website must be a valid URL",
      },
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

// Index untuk sorting berdasarkan tanggal
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ order: 1 });

export default mongoose.model("Experience", experienceSchema);
