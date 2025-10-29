import Experience from "../models/Experience.js";

// Get all experiences
export const getExperiences = async (req, res) => {
  try {
    const {
      employmentType,
      company,
      sortBy = "startDate",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = {};

    if (employmentType) filter.employmentType = employmentType;
    if (company) filter.company = new RegExp(company, "i");

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const experiences = await Experience.find(filter).sort(sort);

    res.json({
      success: true,
      data: experiences,
      count: experiences.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching experiences",
      error: error.message,
    });
  }
};

// Get experience by ID
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching experience",
      error: error.message,
    });
  }
};

// Create new experience (Admin only)
export const createExperience = async (req, res) => {
  try {
    const experienceData = req.body;

    // Set order if not provided
    if (!experienceData.order) {
      const lastExperience = await Experience.findOne().sort({ order: -1 });
      experienceData.order = lastExperience ? lastExperience.order + 1 : 1;
    }

    // If this is marked as current role, update other experiences
    if (experienceData.isCurrentRole) {
      await Experience.updateMany(
        { isCurrentRole: true },
        { isCurrentRole: false }
      );
    }

    const newExperience = new Experience(experienceData);
    await newExperience.save();

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: newExperience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating experience",
      error: error.message,
    });
  }
};

// Update experience (Admin only)
export const updateExperience = async (req, res) => {
  try {
    const experienceData = req.body;

    // If this is marked as current role, update other experiences
    if (experienceData.isCurrentRole) {
      await Experience.updateMany(
        { isCurrentRole: true, _id: { $ne: req.params.id } },
        { isCurrentRole: false }
      );
    }

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      experienceData,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating experience",
      error: error.message,
    });
  }
};

// Delete experience (Admin only)
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting experience",
      error: error.message,
    });
  }
};

// Get current experience
export const getCurrentExperience = async (req, res) => {
  try {
    const currentExperience = await Experience.findOne({ isCurrentRole: true });

    if (!currentExperience) {
      return res.status(404).json({
        success: false,
        message: "No current experience found",
      });
    }

    res.json({
      success: true,
      data: currentExperience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching current experience",
      error: error.message,
    });
  }
};

// Get experience timeline
export const getExperienceTimeline = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ startDate: -1 })
      .select(
        "title company location startDate endDate isCurrentRole employmentType technologies"
      );

    res.json({
      success: true,
      data: experiences,
      count: experiences.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching experience timeline",
      error: error.message,
    });
  }
};

// Get experience statistics (Admin only)
export const getExperienceStats = async (req, res) => {
  try {
    const totalExperiences = await Experience.countDocuments();
    const experiencesByType = await Experience.aggregate([
      { $group: { _id: "$employmentType", count: { $sum: 1 } } },
    ]);

    const experiencesByYear = await Experience.aggregate([
      {
        $group: {
          _id: { $year: "$startDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate total years of experience
    const allExperiences = await Experience.find().select(
      "startDate endDate isCurrentRole"
    );
    let totalMonths = 0;

    allExperiences.forEach((exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.isCurrentRole ? new Date() : new Date(exp.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      totalMonths += diffMonths;
    });

    const totalYears = (totalMonths / 12).toFixed(1);

    res.json({
      success: true,
      data: {
        totalExperiences,
        totalYearsExperience: totalYears,
        currentExperiences: await Experience.countDocuments({
          isCurrentRole: true,
        }),
        experiencesByType,
        experiencesByYear,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching experience statistics",
      error: error.message,
    });
  }
};
