import React, { useState, useEffect, useRef } from "react"; // Added useEffect, useRef
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Snackbar, Alert } from "@mui/material";
import { logout } from "../firebase/auth";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const sessionTimeoutIdRef = useRef(null); // Define sessionTimeoutIdRef here

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogout = async () => {
    try {
      await logout(); // Use the imported logout function
      // Clear the session timestamp on manual logout as well

      if (sessionTimeoutIdRef.current) {
        clearTimeout(sessionTimeoutIdRef.current); // Clear any active session timeout
      }
      setSnackbar({
        open: true,
        message: "Logged out successfully",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      setSnackbar({
        open: true,
        message: "Error logging out",
        severity: "error",
      });
    }
  };

  // useEffect for session management
  useEffect(() => {
    const LOGIN_TIMESTAMP_KEY = "AUTH_";
    const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    const handleSessionLogout = async () => {
      try {
        await logout();
        localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
        setSnackbar({
          open: true,
          message: "Session expired. You have been logged out.",
          severity: "warning",
        });
        navigate("/login");
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
      // Only set timestamp if user is logged in (currentUser exists)
      // This prevents setting it if the layout is somehow rendered before auth check
      if (currentUser) {
        localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
        sessionTimeoutIdRef.current = setTimeout(
          handleSessionLogout,
          SESSION_DURATION
        );
      }
    }

    return () => {
      if (sessionTimeoutIdRef.current) {
        clearTimeout(sessionTimeoutIdRef.current);
      }
    };
  }, [navigate, currentUser, setSnackbar]); // Add currentUser and setSnackbar to dependencies

  
  return (
    <div className="flex h-screen text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userEmail={currentUser?.email} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark p-6">
          <Outlet />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
