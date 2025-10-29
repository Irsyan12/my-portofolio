import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // type: either a regular project or a certificate (certification)
    // This field is required at creation time; code will still treat legacy docs without
    // the field as 'project' when returning results to avoid breaking existing data.
    type: {
      type: String,
      enum: ["project", "certification"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // description is optional for certificates, keep optional here and validate in controller per-type
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    // keep technologies as optional; certificates may use techStack instead
    technologies: [
      {
        type: String,
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
    // Certificate-specific fields (for documents with type === 'certification')
    certificateInstitution: {
      type: String,
      trim: true,
    },
    certificateLink: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Certificate link must be a valid URL",
      },
    },
    // imageUrl is commonly used in the Firebase example
    imageUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Image URL must be a valid URL",
      },
    },
    // alternate fields sometimes provided
    projectLink: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Project link must be a valid URL",
      },
    },
    demoLink: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Demo link must be a valid URL",
      },
    },
    // alternate naming for tech stack arrays
    techStack: [
      {
        type: String,
      },
    ],
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
