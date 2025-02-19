// eslint-disable-next-line no-unused-vars
import React from "react";
import Projects from "../section/Projects";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Projects limit={999} /> {/* Passing a high limit to show all projects */}
    </div>
  );
};

export default ProjectsPage;