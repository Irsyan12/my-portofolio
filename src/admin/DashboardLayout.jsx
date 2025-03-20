import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Snackbar, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSnackbar({
        open: true,
        message: "Logged out successfully",
        severity: "success",
      });
      
      // Redirect to login page after logout
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