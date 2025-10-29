import Project from "../models/Project.js";

/**
 * Helper: ensure type field exists for legacy documents
 */
function ensureType(project) {
  const obj = project.toObject ? project.toObject() : project;
  if (!obj.type) obj.type = "project";
  return obj;
}

// Get all projects with filtering and pagination
export const getProjects = async (req, res) => {
  try {
    const {
      category,
      featured,
      status,
      search,
      type,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = { isPublic: true };

    if (type) {
      // Simple filter by type (assumes migration script has run and all docs have correct type)
      // For legacy compatibility: if type=project, also include docs without type field
      if (type === "project") {
        filter.$or = [{ type: "project" }, { type: { $exists: false } }];
      } else {
        // Direct match for certification or other types
        filter.type = type;
      }
    }
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === "true";
    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    // Ensure response includes `type` for older documents that did not have the field
    const projectsResp = projects.map(ensureType);

    res.json({
      success: true,
      data: projectsResp,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProjects: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get all projects for admin (including private ones)
export const getAllProjectsAdmin = async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      type,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = {};

    if (type) {
      // Simple filter by type
      if (type === "project") {
        filter.$or = [{ type: "project" }, { type: { $exists: false } }];
      } else {
        filter.type = type;
      }
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    // Ensure response includes `type` for older documents that did not have the field
    const projectsResp = projects.map(ensureType);

    res.json({
      success: true,
      data: projectsResp,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProjects: total,
        hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get featured projects
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      featured: true,
      isPublic: true,
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    // Ensure `type` exists in response for legacy documents
    const projectsResp = projects.map(ensureType);

    res.json({
      success: true,
      data: projectsResp,
      count: projectsResp.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured projects",
      error: error.message,
    });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if project is public or user is admin
    if (!project.isPublic && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this project",
      });
    }

    const projectObj = ensureType(project);

    res.json({
      success: true,
      data: projectObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching project",
      error: error.message,
    });
  }
};

// Create new project (Admin only)
export const createProject = async (req, res) => {
  try {
    const projectData = req.body;

    // Require type in request body
    if (!projectData.type) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: type",
        error:
          "Field 'type' is required and must be either 'project' or 'certification'",
      });
    }

    const type = projectData.type;
    if (!["project", "certification"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
        error: "type must be either 'project' or 'certification'",
      });
    }

    // Per-type required field checks
    if (type === "project") {
      if (!projectData.title || !projectData.description) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields for project",
          error: "title and description are required for type 'project'",
        });
      }

      // Set order if not provided (projects ordering)
      if (!projectData.order) {
        const lastProject = await Project.findOne({ type: "project" }).sort({
          order: -1,
        });
        projectData.order = lastProject ? lastProject.order + 1 : 1;
      }
    }

    if (type === "certification") {
      // For certificates, title and createdAt (handled by timestamps) are typically enough.
      if (!projectData.title) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields for certification",
          error: "title is required for type 'certification'",
        });
      }
    }

    const newProject = new Project(projectData);
    await newProject.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: newProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating project",
      error: error.message,
    });
  }
};

// Update project (Admin only)
export const updateProject = async (req, res) => {
  try {
    // If type is being changed, validate it
    if (
      req.body.type &&
      !["project", "certification"].includes(req.body.type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
        error: "type must be either 'project' or 'certification'",
      });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

// Delete project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting project",
      error: error.message,
    });
  }
};

// Toggle project featured status (Admin only)
export const toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.json({
      success: true,
      message: `Project ${
        project.featured ? "featured" : "unfeatured"
      } successfully`,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
};

// Get project statistics (Admin only)
export const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.countDocuments({ featured: true });
    const projectsByCategory = await Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const projectsByStatus = await Project.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        publicProjects: await Project.countDocuments({ isPublic: true }),
        privateProjects: await Project.countDocuments({ isPublic: false }),
        projectsByCategory,
        projectsByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching project statistics",
      error: error.message,
    });
  }
};
