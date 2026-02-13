import React, { useEffect, useState } from "react";
import { Snackbar, Alert, Card, CardContent } from "@mui/material";
import {
  FaProjectDiagram,
  FaBriefcase,
  FaComments,
  FaEnvelope,
  FaEye,
  FaStar,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaClock,
  FaLink,
} from "react-icons/fa";
import {
  projectsAPI,
  experiencesAPI,
  messagesAPI,
  feedbackAPI,
  analyticsAPI,
} from "../api";
import VisitsChart from "../components/VisitsChart";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: { total: 0, featured: 0 },
    experiences: { total: 0, current: 0 },
    messages: { total: 0, new: 0, starred: 0 },
    feedback: { total: 0, average: 0 },
    visits: { total: 0, today: 0 },
  });
  const [visitsData, setVisitsData] = useState([]);
  const [analyticsDetails, setAnalyticsDetails] = useState({
    deviceStats: [],
    browserStats: [],
    osStats: [],
    topPages: [],
    topReferrers: [],
    averageDuration: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch all stats in parallel
        const [
          projectsRes,
          experiencesRes,
          messagesRes,
          feedbackRes,
          analyticsRes,
        ] = await Promise.all([
          projectsAPI.getStats(),
          experiencesAPI.getStats(),
          messagesAPI.getStats(),
          feedbackAPI.getStats(),
          analyticsAPI.getAnalytics({ period: "30d" }),
        ]);

        // Update stats
        setStats({
          projects: projectsRes.success
            ? projectsRes.data
            : { total: 0, featured: 0 },
          experiences: experiencesRes.success
            ? experiencesRes.data
            : { total: 0, current: 0 },
          messages: messagesRes.success
            ? {
                total: messagesRes.data.totalMessages || 0,
                new: messagesRes.data.newMessages || 0,
                starred: messagesRes.data.starredMessages || 0,
              }
            : { total: 0, new: 0, starred: 0 },
          feedback: feedbackRes.success
            ? feedbackRes.data
            : { total: 0, average: 0 },
          visits: analyticsRes.success
            ? analyticsRes.data.summary
            : { totalVisits: 0, uniqueVisitors: 0 },
        });

        // Set visits data for chart
        if (analyticsRes.success && analyticsRes.data.dailyVisits) {
          setVisitsData(analyticsRes.data.dailyVisits);
        }

        // Set detailed analytics data
        if (analyticsRes.success) {
          setAnalyticsDetails({
            deviceStats: analyticsRes.data.deviceStats || [],
            browserStats: analyticsRes.data.browserStats || [],
            osStats: analyticsRes.data.osStats || [],
            topPages: analyticsRes.data.topPages || [],
            topReferrers: analyticsRes.data.topReferrers || [],
            averageDuration: analyticsRes.data.summary?.averageDuration || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions
  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case "desktop":
        return <FaDesktop />;
      case "mobile":
        return <FaMobileAlt />;
      case "tablet":
        return <FaTabletAlt />;
      default:
        return <FaDesktop />;
    }
  };

  const getBrowserIcon = (browser) => {
    switch (browser?.toLowerCase()) {
      case "chrome":
        return <FaChrome />;
      case "firefox":
        return <FaFirefox />;
      case "safari":
        return <FaSafari />;
      case "edge":
        return <FaEdge />;
      default:
        return <FaChrome />;
    }
  };

  const getOSIcon = (os) => {
    const osLower = os?.toLowerCase() || "";
    if (osLower.includes("windows")) return <FaWindows />;
    if (osLower.includes("mac") || osLower.includes("ios")) return <FaApple />;
    if (osLower.includes("linux")) return <FaLinux />;
    if (osLower.includes("android")) return <FaAndroid />;
    return <FaDesktop />;
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0s";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  const calculatePercentage = (count, total) => {
    if (!total || total === 0) return 0;
    return ((count / total) * 100).toFixed(1);
  };

  const getTotalCount = (statsArray) => {
    return statsArray.reduce((sum, item) => sum + (item.count || 0), 0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <h1 className="text-color1 text-2xl md:text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            {/* Projects Card */}
            <Card
              sx={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Projects</p>
                    <p className="text-color1 text-2xl font-bold">
                      {stats.projects.total}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stats.projects.featured} featured
                    </p>
                  </div>
                  <FaProjectDiagram
                    className="text-color1 opacity-20"
                    size={40}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experiences Card */}
            <Card
              sx={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Experiences</p>
                    <p className="text-color1 text-2xl font-bold">
                      {stats.experiences.total}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stats.experiences.current} current
                    </p>
                  </div>
                  <FaBriefcase className="text-color1 opacity-20" size={40} />
                </div>
              </CardContent>
            </Card>

            {/* Messages Card */}
            <Card
              sx={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Messages</p>
                    <p className="text-color1 text-2xl font-bold">
                      {stats.messages.total}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stats.messages.new} new · {stats.messages.starred}{" "}
                      starred
                    </p>
                  </div>
                  <FaEnvelope className="text-color1 opacity-20" size={40} />
                </div>
              </CardContent>
            </Card>

            {/* Feedback Card */}
            <Card
              sx={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Feedback</p>
                    <p className="text-color1 text-2xl font-bold">
                      {stats.feedback.total}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <FaStar className="text-yellow-400" size={10} />
                      {stats.feedback.averageRating?.toFixed(1) || 0} avg rating
                    </p>
                  </div>
                  <FaComments className="text-color1 opacity-20" size={40} />
                </div>
              </CardContent>
            </Card>

            {/* Visits Card */}
            <Card
              sx={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Visits (30d)</p>
                    <p className="text-color1 text-2xl font-bold">
                      {stats.visits.totalVisits || 0}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {stats.visits.uniqueVisitors || 0} unique
                    </p>
                  </div>
                  <FaEye className="text-color1 opacity-20" size={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Insights Section */}
          {analyticsDetails.deviceStats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Device Breakdown */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h3 className="text-color1 text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaDesktop className="text-color1" />
                    Device Breakdown
                  </h3>
                  <div className="space-y-3">
                    {analyticsDetails.deviceStats.map((device, index) => {
                      const total = getTotalCount(analyticsDetails.deviceStats);
                      const percentage = calculatePercentage(
                        device.count,
                        total
                      );
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 flex items-center gap-2">
                              {getDeviceIcon(device._id)}
                              {device._id.charAt(0).toUpperCase() +
                                device._id.slice(1)}
                            </span>
                            <span className="text-color1 font-semibold">
                              {device.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                              className="bg-color1 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Browser Stats */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h3 className="text-color1 text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaChrome className="text-color1" />
                    Browser Distribution
                  </h3>
                  <div className="space-y-3">
                    {analyticsDetails.browserStats.map((browser, index) => {
                      const total = getTotalCount(
                        analyticsDetails.browserStats
                      );
                      const percentage = calculatePercentage(
                        browser.count,
                        total
                      );
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 flex items-center gap-2">
                              {getBrowserIcon(browser._id)}
                              {browser._id}
                            </span>
                            <span className="text-color1 font-semibold">
                              {browser.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                              className="bg-color1 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* OS Distribution */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h3 className="text-color1 text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaWindows className="text-color1" />
                    Operating Systems
                  </h3>
                  <div className="space-y-3">
                    {analyticsDetails.osStats.map((os, index) => {
                      const total = getTotalCount(analyticsDetails.osStats);
                      const percentage = calculatePercentage(os.count, total);
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 flex items-center gap-2">
                              {getOSIcon(os._id)}
                              {os._id}
                            </span>
                            <span className="text-color1 font-semibold">
                              {os.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-2">
                            <div
                              className="bg-color1 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Average Duration */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h3 className="text-color1 text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaClock className="text-color1" />
                    Average Session
                  </h3>
                  <div className="flex flex-col items-center justify-center h-32">
                    <div className="text-5xl font-bold text-color1 mb-2">
                      {formatDuration(analyticsDetails.averageDuration)}
                    </div>
                    <p className="text-gray-400 text-sm">per visit</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Referrers */}
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h3 className="text-color1 text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaLink className="text-color1" />
                    Traffic Sources
                  </h3>
                  <div className="space-y-2">
                    {analyticsDetails.topReferrers
                      .slice(0, 5)
                      .map((referrer, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 rounded bg-zinc-800/50"
                        >
                          <span className="text-gray-300 text-sm truncate">
                            {referrer._id === "direct"
                              ? "Direct Traffic"
                              : referrer._id}
                          </span>
                          <span className="text-color1 font-semibold text-sm">
                            {referrer.count}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Visits Chart */}
          <div className="mt-6">
            {visitsData && visitsData.length > 0 ? (
              <VisitsChart visitsData={visitsData} />
            ) : (
              <Card
                sx={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                }}
              >
                <CardContent>
                  <h2 className="text-color1 text-xl font-semibold mb-4">
                    Website Visits (Last 30 Days)
                  </h2>
                  <p className="text-gray-400">No visit data available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
