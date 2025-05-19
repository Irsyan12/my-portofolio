import React, { useEffect, useState, useRef } from "react";
import { db, doc, getDoc } from "../firebase/firebase";
import { logout } from "../firebase/auth"; // Import logout
import { Snackbar, Alert } from "@mui/material";
import VisitsChart from "../components/VisitsChart";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [timestamps, setTimestamps] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const sessionTimeoutIdRef = useRef(null); // Ref to store timeout ID
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visitRef = doc(db, "analytics", "website_visits");
        const visitSnap = await getDoc(visitRef);

        if (visitSnap.exists()) {
          const data = visitSnap.data();
          setTotalVisits(data.total_visits || 0);

          if (data.timestamps && Array.isArray(data.timestamps)) {
            console.log("Timestamps from Firestore:", data.timestamps.length);
            setTimestamps(data.timestamps);
          } else {
            console.log("No timestamps array found in Firestore document");
          }
        } else {
          console.log("Document doesn't exist");
        }
      } catch (error) {
        console.error("Error fetching visits:", error);
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
      }
    };

    fetchVisits();
  }, []);

  // useEffect for session management
  useEffect(() => {
    const LOGIN_TIMESTAMP_KEY = "loginTimestamp";
    const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    const handleSessionLogout = async () => {
      try {
        await logout();
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
        setSnackbar({
          open: true,
          message: "Session expired. You have been logged out.",
          severity: "warning", // Or 'info'
        });
        navigate("/login"); // Correct way to navigate
      } catch (error) {
        console.error("Error during session logout:", error);
        setSnackbar({
          open: true,
          message: `Error logging out: ${error.message}`,
          severity: "error",
        });
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      }
    };

    const storedTimestampStr = localStorage.getItem(LOGIN_TIMESTAMP_KEY);

    if (storedTimestampStr) {
      const storedTimestamp = parseInt(storedTimestampStr, 10);
      const elapsedTime = Date.now() - storedTimestamp;

      if (elapsedTime >= SESSION_DURATION) {
        handleSessionLogout();
      } else {
        const remainingTime = SESSION_DURATION - elapsedTime;
        sessionTimeoutIdRef.current = setTimeout(
          handleSessionLogout,
          remainingTime
        );
      }
    } else {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
      sessionTimeoutIdRef.current = setTimeout(
        handleSessionLogout,
        SESSION_DURATION
      );
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      if (sessionTimeoutIdRef.current) {
        clearTimeout(sessionTimeoutIdRef.current);
      }
    };
  }, [navigate]); // Add navigate to dependency array as it's used inside useEffect

  return (
    <div>
      <h1 className="text-color1 text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <h2 className="text-color1 text-xl font-semibold mb-4">
            Experiences
          </h2>
          <p className="text-gray-300">Total Experiences: 1</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <h2 className="text-color1 text-xl font-semibold mb-4">Projects</h2>
          <p className="text-gray-300">Total Projects: 1</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <h2 className="text-color1 text-xl font-semibold mb-4">
            Total Web Visited
          </h2>
          <p className="text-gray-300">{totalVisits}</p>
        </div>
        <div className="col-span-1 md:col-span-2">
          {timestamps.length > 0 ? (
            <VisitsChart timestamps={timestamps} />
          ) : (
            <div className="bg-[#1E1E1E] p-6 rounded-lg">
              <h2 className="text-color1 text-xl font-semibold mb-4">
                Website Visit Chart
              </h2>
              <p className="text-gray-300">No visit data available</p>
            </div>
          )}
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000} // Increased duration for session expiry message
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }} // Ensure alert takes full width of snackbar
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
