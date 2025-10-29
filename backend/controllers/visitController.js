import Visit from "../models/Visit.js";

// Track new visit (Public endpoint)
export const trackVisit = async (req, res) => {
  try {
    const { page, referrer, sessionId, duration = 0 } = req.body;

    const visitData = {
      page,
      referrer: referrer || "",
      sessionId,
      duration,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent") || "Unknown",
    };

    // Check if this is a unique visit (same IP and page in last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const existingVisit = await Visit.findOne({
      ipAddress: visitData.ipAddress,
      page: visitData.page,
      createdAt: { $gte: yesterday },
    });

    visitData.isUnique = !existingVisit;

    // Parse user agent for device info (basic detection)
    const userAgent = visitData.userAgent.toLowerCase();
    if (
      userAgent.includes("mobile") ||
      userAgent.includes("android") ||
      userAgent.includes("iphone")
    ) {
      visitData.device = "mobile";
    } else if (userAgent.includes("tablet") || userAgent.includes("ipad")) {
      visitData.device = "tablet";
    } else {
      visitData.device = "desktop";
    }

    // Basic browser detection
    if (userAgent.includes("chrome")) {
      visitData.browser = "Chrome";
    } else if (userAgent.includes("firefox")) {
      visitData.browser = "Firefox";
    } else if (userAgent.includes("safari")) {
      visitData.browser = "Safari";
    } else if (userAgent.includes("edge")) {
      visitData.browser = "Edge";
    } else {
      visitData.browser = "Other";
    }

    // Basic OS detection
    if (userAgent.includes("windows")) {
      visitData.os = "Windows";
    } else if (userAgent.includes("mac")) {
      visitData.os = "macOS";
    } else if (userAgent.includes("linux")) {
      visitData.os = "Linux";
    } else if (userAgent.includes("android")) {
      visitData.os = "Android";
    } else if (userAgent.includes("ios")) {
      visitData.os = "iOS";
    } else {
      visitData.os = "Other";
    }

    const newVisit = new Visit(visitData);
    await newVisit.save();

    res.status(201).json({
      success: true,
      message: "Visit tracked successfully",
      data: {
        visit: {
          _id: newVisit._id,
          isUnique: newVisit.isUnique,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error tracking visit",
      error: error.message,
    });
  }
};

// Get visit analytics (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    const { period = "30d", page, startDate, endDate } = req.query;

    // Calculate date range
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      const now = new Date();
      const periodDays =
        period === "7d"
          ? 7
          : period === "30d"
          ? 30
          : period === "90d"
          ? 90
          : 365;
      const startPeriod = new Date();
      startPeriod.setDate(now.getDate() - periodDays);

      dateFilter = {
        createdAt: { $gte: startPeriod },
      };
    }

    // Add page filter if specified
    const baseFilter = page ? { ...dateFilter, page } : dateFilter;

    // Total visits and unique visits
    const totalVisits = await Visit.countDocuments(baseFilter);
    const uniqueVisits = await Visit.countDocuments({
      ...baseFilter,
      isUnique: true,
    });

    // Visits by day
    const visitsByDay = await Visit.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          total: { $sum: 1 },
          unique: { $sum: { $cond: [{ $eq: ["$isUnique", true] }, 1, 0] } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format dailyVisits for chart (convert to date string format)
    const dailyVisits = visitsByDay.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return {
        _id: date.toISOString().split("T")[0], // Format: "2024-01-15"
        count: item.total,
        unique: item.unique,
      };
    });

    // Top pages
    const topPages = await Visit.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$page",
          total: { $sum: 1 },
          unique: { $sum: { $cond: [{ $eq: ["$isUnique", true] }, 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
    ]);

    // Device breakdown
    const deviceStats = await Visit.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Browser breakdown
    const browserStats = await Visit.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // OS breakdown
    const osStats = await Visit.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$os",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top referrers
    const topReferrers = await Visit.aggregate([
      {
        $match: {
          ...baseFilter,
          referrer: { $ne: "" },
        },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Average session duration
    const avgDurationResult = await Visit.aggregate([
      { $match: { ...baseFilter, duration: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    const averageDuration =
      avgDurationResult.length > 0
        ? Math.round(avgDurationResult[0].avgDuration)
        : 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalVisits,
          uniqueVisitors: uniqueVisits,
          averageDuration,
          period,
        },
        dailyVisits,
        visitsByDay,
        topPages,
        deviceStats,
        browserStats,
        osStats,
        topReferrers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message,
    });
  }
};

// Get real-time statistics (Admin only)
export const getRealTimeStats = async (req, res) => {
  try {
    const now = new Date();

    // Last 24 hours
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    // Last hour
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);

    const stats24h = await Visit.countDocuments({
      createdAt: { $gte: last24h },
    });

    const statsLastHour = await Visit.countDocuments({
      createdAt: { $gte: lastHour },
    });

    const uniqueStats24h = await Visit.countDocuments({
      createdAt: { $gte: last24h },
      isUnique: true,
    });

    // Current active pages (last 5 minutes)
    const last5min = new Date();
    last5min.setMinutes(last5min.getMinutes() - 5);

    const activePages = await Visit.aggregate([
      { $match: { createdAt: { $gte: last5min } } },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        last24Hours: stats24h,
        lastHour: statsLastHour,
        uniqueLast24Hours: uniqueStats24h,
        activePages,
        timestamp: now,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching real-time statistics",
      error: error.message,
    });
  }
};

// Get visit trends (Admin only)
export const getVisitTrends = async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    const now = new Date();
    const periodDays =
      period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(now.getDate() - periodDays);

    // Current period
    const currentPeriodVisits = await Visit.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Previous period for comparison
    const prevStartDate = new Date();
    prevStartDate.setDate(startDate.getDate() - periodDays);

    const previousPeriodVisits = await Visit.countDocuments({
      createdAt: {
        $gte: prevStartDate,
        $lt: startDate,
      },
    });

    // Calculate percentage change
    const percentageChange =
      previousPeriodVisits > 0
        ? (
            ((currentPeriodVisits - previousPeriodVisits) /
              previousPeriodVisits) *
            100
          ).toFixed(2)
        : 100;

    // Hourly breakdown for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const hourlyVisits = await Visit.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        currentPeriod: currentPeriodVisits,
        previousPeriod: previousPeriodVisits,
        percentageChange: parseFloat(percentageChange),
        trend: parseFloat(percentageChange) >= 0 ? "up" : "down",
        hourlyVisits,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching visit trends",
      error: error.message,
    });
  }
};

// Update visit duration (Public endpoint - called on page unload)
export const updateVisitDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;

    if (!duration || duration < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration value",
      });
    }

    const visit = await Visit.findByIdAndUpdate(
      id,
      { duration },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Duration updated successfully",
      data: {
        duration: visit.duration,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating duration",
      error: error.message,
    });
  }
};
