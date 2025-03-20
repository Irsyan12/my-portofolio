import React, { useEffect, useState } from "react";
import {
  db,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  Timestamp,
} from "../firebase/firebase"; // Sesuaikan path
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import ExperiencesPage from "./ExperiencesPage";
import ProjectsPage from "./ProjectsPage";
import { Snackbar, Alert } from "@mui/material";
import VisitsChart from "../components/VisitsChart";

const DashboardHome = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [timestamps, setTimestamps] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const visitRef = doc(db, "analytics", "website_visits");
        const visitSnap = await getDoc(visitRef);

        if (visitSnap.exists()) {
          const data = visitSnap.data();
          setTotalVisits(data.total_visits || 0);

          // Ambil data timestamps dari Firestore
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

      {/* Snackbar untuk menampilkan error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="" element={<DashboardHome />} />
        <Route path="experiences" element={<ExperiencesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
