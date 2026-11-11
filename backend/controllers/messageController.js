import Message from "../models/Message.js";

// Get all messages (Admin only)
export const getMessages = async (req, res) => {
  try {
    const {
      status,
      isStarred,
      search,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = {};

    const allowedStatuses = ["new", "read", "archived"];
    if (status && allowedStatuses.includes(status)) filter.status = status;
    if (isStarred !== undefined) filter.isStarred = isStarred === "true";

    if (search && typeof search === "string") {
      filter.$text = { $search: search.slice(0, 100) };
    }

    // Calculate skip value for pagination
    const validLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
    const validPage = Math.max(parseInt(page) || 1, 1);
    const skip = (validPage - 1) * validLimit;

    // Build sort object with whitelisted fields
    const allowedSortFields = ["createdAt", "updatedAt", "status", "urgency", "name", "email", "subject"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sort = {};
    sort[validSortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const messages = await Message.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(validLimit);

    const total = await Message.countDocuments(filter);

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: validPage,
        totalPages: Math.ceil(total / validLimit),
        totalMessages: total,
        hasNext: validPage < Math.ceil(total / validLimit),
        hasPrev: validPage > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

// Get message by ID (Admin only)
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Mark as read if it's new
    if (message.status === "new") {
      message.status = "read";
      await message.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching message",
      error: error.message,
    });
  }
};

// Create new message (Public endpoint)
export const createMessage = async (req, res) => {
  try {
    // Validate required fields
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        error: "Name, email, subject, and message are required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid field format",
        error: "Name, email, subject, and message must be strings",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (
      trimmedName.length > 100 ||
      trimmedEmail.length > 150 ||
      trimmedSubject.length > 200 ||
      trimmedMessage.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "Input length exceeds allowed limits",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        error: "Please provide a valid email address",
      });
    }

    const messageData = {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    };

    const newMessage = new Message(messageData);
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: {
        id: newMessage._id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    // Handle different types of errors
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
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Update message status (Admin only)
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message status updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating message status",
      error: error.message,
    });
  }
};

// Toggle star status (Admin only)
export const toggleStar = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.isStarred = !message.isStarred;
    await message.save();

    res.json({
      success: true,
      message: `Message ${
        message.isStarred ? "starred" : "unstarred"
      } successfully`,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating message",
      error: error.message,
    });
  }
};

// Delete message (Admin only)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting message",
      error: error.message,
    });
  }
};

// Get message statistics (Admin only)
export const getMessageStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const newMessages = await Message.countDocuments({ status: "new" });
    const starredMessages = await Message.countDocuments({ isStarred: true });

    const messagesByStatus = await Message.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const messagesByUrgency = await Message.aggregate([
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ]);

    const messagesByMonth = await Message.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Recent messages (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    res.json({
      success: true,
      data: {
        totalMessages,
        newMessages,
        starredMessages,
        recentMessages,
        messagesByStatus,
        messagesByUrgency,
        messagesByMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching message statistics",
      error: error.message,
    });
  }
};

// Get recent messages (Admin only)
export const getRecentMessages = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("name email subject status urgency isStarred createdAt");

    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent messages",
      error: error.message,
    });
  }
};
