import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectsAPI } from "../api";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const ProjectsSection = ({ limit = 6 }) => {
  const [activeTab, setActiveTab] = useState("project"); // "project" or "certification"
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [displayLimit, setDisplayLimit] = useState(limit);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWithRetry(
          async () => {
            const res = await projectsAPI.getAll();
            if (!res.success) throw new Error("Failed to fetch projects");
            return res;
          },
          { retryDelay: 3000, timeout: 60000 }
        );
        setAllProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setAllProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const openDetailModal = (project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = "auto";
  };

  const filteredProjects = allProjects.filter(
    (p) => p.type?.toLowerCase() === activeTab
  );

  const itemsToDisplay = filteredProjects.slice(0, displayLimit);

  return (
    <div
      className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">Recent Work</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { setActiveTab("project"); setDisplayLimit(limit); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              activeTab === "project"
                ? "bg-amber-500 text-black glow-orange"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("certification"); setDisplayLimit(limit); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
              activeTab === "certification"
                ? "bg-emerald-500 text-black glow-green"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            Certificates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 animate-pulse">
              <div className="aspect-video bg-neutral-800"></div>
              <div className="p-5">
                <div className="h-5 bg-neutral-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : itemsToDisplay.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 text-center text-neutral-500 py-10">
            No items found.
          </div>
        ) : (
          itemsToDisplay.map((project, index) => (
            <div
              key={project._id}
              className="group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 cursor-pointer"
              onClick={() => openDetailModal(project)}
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.imageUrl || "https://placehold.co/600x400?text=No+Image"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(project.techStack?.slice(0, 3) || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-neutral-800 rounded text-[10px] text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 3 && (
                    <span className="px-2 py-1 bg-neutral-800 rounded text-[10px] text-neutral-300">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && filteredProjects.length > displayLimit && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setDisplayLimit((prev) => prev + 6)}
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition group cursor-pointer"
          >
            View more
            <i className="ri-arrow-down-line group-hover:translate-y-1 transition-transform"></i>
          </button>
        </div>
      )}

      {isDetailModalOpen && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default ProjectsSection;
