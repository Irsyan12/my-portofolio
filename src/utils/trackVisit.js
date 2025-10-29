import { analyticsAPI } from "../api";

/**
 * Track visitor dengan rate limiting (1 visit per 15 minutes)
 * Menggunakan localStorage untuk mencegah duplicate tracking
 */
export const trackVisit = async () => {
  try {
    const lastVisit = localStorage.getItem("last_visit_tracked");
    const now = Date.now();

    // Check if last visit was more than 15 minutes ago
    if (lastVisit && now - parseInt(lastVisit) < 15 * 60 * 1000) {
      console.log("Visit already tracked within last 15 minutes");
      return;
    }

    // Get visitor data
    const visitData = {
      page: window.location.pathname,
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
      // Generate session ID (stored in sessionStorage for session persistence)
      sessionId:
        sessionStorage.getItem("session_id") ||
        `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };

    // Store session ID for the session
    if (!sessionStorage.getItem("session_id")) {
      sessionStorage.setItem("session_id", visitData.sessionId);
    }

    // Track the visit
    const response = await analyticsAPI.track(visitData);

    if (response.success) {
      // Store visit ID and timestamp for duration tracking
      const visitId = response.data?.visit?._id;
      if (visitId) {
        sessionStorage.setItem("current_visit_id", visitId);
        sessionStorage.setItem("page_load_time", Date.now().toString());
      }

      // Update last visit timestamp
      localStorage.setItem("last_visit_tracked", now.toString());
      console.log("✅ Visit tracked successfully", { visitId });

      // Set timeout to clear localStorage after 15 minutes
      setTimeout(() => {
        localStorage.removeItem("last_visit_tracked");
      }, 15 * 60 * 1000);
    }
  } catch (error) {
    console.error("❌ Error tracking visit:", error);
    // Don't throw error to avoid breaking the app
  }
};

/**
 * Update visit duration when user leaves the page
 */
const updateVisitDuration = async () => {
  try {
    const visitId = sessionStorage.getItem("current_visit_id");
    const pageLoadTime = sessionStorage.getItem("page_load_time");

    if (!visitId || !pageLoadTime) {
      return;
    }

    // Calculate duration in seconds
    const duration = Math.floor((Date.now() - parseInt(pageLoadTime)) / 1000);

    // Only update if duration is significant (at least 1 second)
    if (duration < 1) {
      return;
    }

    // Send duration update using sendBeacon (reliable for page unload)
    const data = JSON.stringify({ duration });
    const blob = new Blob([data], { type: "application/json" });
    const url = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    }/visits/${visitId}/duration`;

    // sendBeacon is more reliable than fetch during page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
      console.log(`📊 Duration updated: ${duration}s`);
    } else {
      // Fallback to fetch with keepalive
      fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: data,
        keepalive: true,
      }).catch(() => {
        // Ignore errors during unload
      });
    }
  } catch (error) {
    // Ignore errors during unload
    console.error("Error updating duration:", error);
  }
};

/**
 * Track page duration when user leaves
 */
export const trackPageDuration = () => {
  const pageLoadTime = Date.now();
  sessionStorage.setItem("page_load_time", pageLoadTime.toString());

  // Update duration on various leave events
  const handleBeforeUnload = () => {
    updateVisitDuration();
  };

  const handleVisibilityChange = () => {
    // Update duration when tab becomes hidden (user switches tab)
    if (document.visibilityState === "hidden") {
      updateVisitDuration();
    }
  };

  // Listen to multiple events for better coverage
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handleBeforeUnload); // iOS Safari
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Cleanup function
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("pagehide", handleBeforeUnload);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};
