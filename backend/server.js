import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      error:
        "Please check your JSON syntax. Make sure all property names are in double quotes.",
    });
  }
  next();
});

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// MongoDB connection options for Vercel serverless
const mongooseOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB with better error handling for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    if (process.env.VERCEL) {
      // Don't exit in serverless
      throw err;
    } else {
      process.exit(1);
    }
  }
};

// Initial connection
connectDB();

// MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("🔌 MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio Backend API is running! 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      users: "/api/users",
      projects: "/api/projects",
      experiences: "/api/experiences",
      messages: "/api/messages",
      feedback: "/api/feedback",
      analytics: "/api/visits",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/visits", visitRoutes);

// API Status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    status: "operational",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to check project types in DB
app.get("/api/debug/projects-types", async (req, res) => {
  try {
    const Project = mongoose.model("Project");
    const allProjects = await Project.find(
      {},
      { title: 1, type: 1, _id: 1 }
    ).limit(50);
    const typeCounts = await Project.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
    const missingType = await Project.countDocuments({
      type: { $exists: false },
    });

    res.json({
      success: true,
      data: {
        projects: allProjects,
        typeCounts,
        missingType,
        total: allProjects.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /",
      "GET /api/status",
      "* /api/users",
      "* /api/projects",
      "* /api/experiences",
      "* /api/messages",
      "* /api/feedback",
      "* /api/visits",
    ],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      field,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Local development - start server normally
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `📱 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`
    );
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("📤 SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("🔚 HTTP server closed");
      mongoose.connection.close().then(() => {
        console.log("🔌 MongoDB connection closed");
        process.exit(0);
      });
    });
  });

  process.on("SIGINT", () => {
    console.log("📤 SIGINT signal received: closing HTTP server");
    server.close(() => {
      console.log("🔚 HTTP server closed");
      mongoose.connection.close().then(() => {
        console.log("🔌 MongoDB connection closed");
        process.exit(0);
      });
    });
  });
}

// Export for Vercel serverless
export default app;
