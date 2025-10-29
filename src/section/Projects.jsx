// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust path if necessary
import ProjectDetailModal from "../components/ProjectDetailModal"; // Import the new modal

// eslint-disable-next-line react/prop-types
const Projects = ({ limit = 8 }) => {
  const categories = ["All", "Project", "Certification"];
  const [activeType, setActiveType] = useState("All");
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // State for modal visibility
  const [selectedProject, setSelectedProject] = useState(null); // State for selected project data

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openDetailModal = (project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = "auto"; // Restore background scroll
  };

  const classColorforType = (type) => {
    switch (type) {
      case "Project":
        return "bg-color1";
      case "Certification":
        return "bg-teal-400";
      default:
        return "bg-gray-500";
    }
  };

  let itemsToDisplay = [];
  if (!isLoading && allProjects.length > 0) {
    const projectsForCategoryFilter = allProjects.filter((project) =>
      activeType === "All" ? true : project.type === activeType
    );

    if (limit >= 999) {
      itemsToDisplay = projectsForCategoryFilter;
    } else {
      if (activeType === "All") {
        const projectItems = allProjects
          .filter((p) => p.type === "Project")
          .slice(0, 4);
        const certificationItems = allProjects
          .filter((p) => p.type === "Certification")
          .slice(0, 4);
        itemsToDisplay = [...projectItems, ...certificationItems].slice(
          0,
          limit
        );
      } else {
        itemsToDisplay = projectsForCategoryFilter.slice(0, limit);
      }
    }
  }

  return (
    <section
      className="pt-20 pb-10 w-11/12 md:w-5/6 mx-auto text-white"
      id="projects"
    >
      <div
        className="text-center mb-12 cursor-default"
        data-aos="fade-right"
        data-aos-delay={500}
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 text-color1"
          data-aos="fade-left"
          data-aos-delay={500}
        >
          My Projects & Certifications
        </h2>
        <p className="text-text-gray-400 max-w-2xl mx-auto">
          Here are some of my projects and certifications that I have completed
          during my learning journey
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((type, index) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-2 cursor-pointer rounded-full transition-colors 
              ${
                activeType === type
                  ? "bg-color1 text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            data-aos="fade-right"
            data-aos-delay={index * 70}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden bg-white/5 animate-pulse"
            >
              <div className="relative aspect-4/3 bg-gray-700/40" />
              <div className="p-6">
                <div className="h-4 w-16 bg-gray-700/40 rounded-full mb-2" />
                <div className="h-6 w-32 bg-gray-700/40 rounded mb-2" />
              </div>
            </div>
          ))}
        </div>
      ) : itemsToDisplay.length === 0 ? (
        <div className="text-center text-gray-400">
          No projects found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {itemsToDisplay.map((project, index) => (
            <div
              key={project.id}
              className="group relative rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={
                    project.imageUrl ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <span
                  className={`${classColorforType(
                    project.type
                  )} text-dark font-semibold rounded-full px-2 py-1 text-xs`}
                >
                  {project.type}
                </span>
                <h3 className="text-md md:text-lg font-semibold mt-2 text-color2">
                  {project.title}
                </h3>
              </div>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => openDetailModal(project)}
                  className={`px-6 py-3 cursor-pointer text-sm md:text-md ${classColorforType(
                    project.type
                  )} text-black rounded-full transform -translate-y-4 group-hover:translate-y-0 transition-transform`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && allProjects.length > limit && limit < 999 && (
        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-block px-8 py-3 bg-color1 text-black rounded-full hover:bg-opacity-90 transition-transform duration-300 hover:-translate-y-1"
            onClick={() => window.scrollTo(0, 0)}
          >
            See More Projects
          </Link>
        </div>
      )}
      {isDetailModalOpen && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={closeDetailModal}
        />
      )}
    </section>
  );
};

export default Projects;
