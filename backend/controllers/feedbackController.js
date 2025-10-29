import Feedback from "../models/Feedback.js";

// Get all public feedback
export const getPublicFeedback = async (req, res) => {
  try {
    const {
      rating,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object for public feedback
    let filter = {};

    if (rating) filter.rating = parseInt(rating);

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const feedback = await Feedback.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-ipAddress -userAgent");

    const total = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      data: feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalFeedback: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

// Get all feedback (Admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const {
      rating,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = {};

    if (rating) filter.rating = parseInt(rating);

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const feedback = await Feedback.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      data: feedback,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalFeedback: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

// Create new feedback (Public endpoint)
export const createFeedback = async (req, res) => {
  try {
    // Validate required field
    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
        error: "Please provide a rating between 1-5",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating",
        error: "Rating must be between 1 and 5",
      });
    }

    const feedbackData = {
      rating: parseInt(rating),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent") || "Unknown",
    };

    const newFeedback = new Feedback(feedbackData);
    await newFeedback.save();

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      data: {
        id: newFeedback._id,
        rating: newFeedback.rating,
        createdAt: newFeedback.createdAt,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};

// Update feedback (Admin only)
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating feedback",
      error: error.message,
    });
  }
};

// Approve feedback (Admin only)
export const approveFeedback = async (req, res) => {
  try {
    const { isApproved, adminNotes } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        isApproved,
        adminNotes: adminNotes || "",
      },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: `Feedback ${isApproved ? "approved" : "rejected"} successfully`,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating feedback approval",
      error: error.message,
    });
  }
};

// Toggle public status (Admin only)
export const togglePublic = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.isPublic = !feedback.isPublic;
    await feedback.save();

    res.json({
      success: true,
      message: `Feedback made ${
        feedback.isPublic ? "public" : "private"
      } successfully`,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating feedback",
      error: error.message,
    });
  }
};

// Delete feedback (Admin only)
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting feedback",
      error: error.message,
    });
  }
};

// Get feedback statistics (Admin only)
export const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();

    const feedbackByRating = await Feedback.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    // Calculate average rating
    const avgRatingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const averageRating =
      avgRatingResult.length > 0
        ? Math.round(avgRatingResult[0].avgRating * 10) / 10
        : 0;

    // Recent feedback (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentFeedback = await Feedback.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    // Monthly feedback trend (last 6 months)
    const monthlyTrend = await Feedback.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 5,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalFeedback,
        averageRating,
        recentFeedback,
        feedbackByRating,
        monthlyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedback statistics",
      error: error.message,
    });
  }
};

// Get top rated feedback
export const getTopRatedFeedback = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const feedback = await Feedback.find({
      rating: { $gte: 4 },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select("-ipAddress -userAgent");

    res.json({
      success: true,
      data: feedback,
      count: feedback.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top rated feedback",
      error: error.message,
    });
  }
};
