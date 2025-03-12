import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import ExperiencesPage from './ExperiencesPage';
import ProjectsPage from './ProjectsPage';

const DashboardHome = () => {
  return (
    <div>
      <h1 className="text-color1 text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <h2 className="text-color1 text-xl font-semibold mb-4">Experiences</h2>
          <p className="text-gray-300">Total Experiences: 1</p>
        </div>
        <div className="bg-[#1E1E1E] rounded-lg p-6">
          <h2 className="text-color1 text-xl font-semibold mb-4">Projects</h2>
          <p className="text-gray-300">Total Projects: 1</p>
        </div>
      </div>
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
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;