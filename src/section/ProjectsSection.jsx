import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { projectsAPI } from "../api";
import ProjectDetailModal from "../components/ProjectDetailModal";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { RiArrowDownLine } from "react-icons/ri";

const ProjectsSection = ({ limit = 6 }) => {
  const [activeTab, setActiveTab] = useState("project");
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">Recent Work</h2>

        {/* Redesigned filter tabs */}
        <div className="relative flex items-center bg-neutral-900/80 rounded-full p-1 border border-neutral-800 w-64">
          {/* Animated sliding background (solid color, no gradient) */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-neutral-800 border border-neutral-700/50"
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              left: activeTab === "project" ? "4px" : "calc(50% + 2px)",
              width: "calc(50% - 6px)",
            }}
          />
          <button
            onClick={() => { setActiveTab("project"); setDisplayLimit(limit); }}
            className={`relative z-10 flex-1 py-1.5 text-center rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              activeTab === "project"
                ? "text-amber-400"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => { setActiveTab("certification"); setDisplayLimit(limit); }}
            className={`relative z-10 flex-1 py-1.5 text-center rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              activeTab === "certification"
                ? "text-emerald-400"
                : "text-neutral-400 hover:text-neutral-200"
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
          <AnimatePresence mode="wait">
            {itemsToDisplay.map((project, index) => (
              <motion.div
                key={project._id}
                className="group rounded-2xl overflow-hidden bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 cursor-pointer"
                onClick={() => openDetailModal(project)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4 }}
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
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && filteredProjects.length > displayLimit && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setDisplayLimit((prev) => prev + 6)}
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition group cursor-pointer"
          >
            View more
            <RiArrowDownLine className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}

      {isDetailModalOpen && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={closeDetailModal}
        />
      )}
    </motion.div>
  );
};

export default ProjectsSection;
