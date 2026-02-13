import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaLink,
  FaGithub,
  FaPlay,
  FaCertificate,
} from "react-icons/fa";
import { iconDict } from "../utils/getTechIcons"; // Sesuaikan path ke file icon

const ProjectDetailModal = ({ project, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (project) {
      // Short delay to allow initial off-screen/transparent styles to apply before transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [project]);

  if (!project) return null;

  const handleCloseRequest = () => {
    setIsVisible(false); // Trigger slide-out/fade-out animation
    setTimeout(() => {
      onClose(); // Call parent's onClose after animation
    }, 300); // This duration should match the CSS transition duration
  };

  const renderLinkIcon = (link, type) => {
    if (!link) return null;
    let icon = <FaLink size={20} />;
    let tooltip = "View Link";

    if (type === "demo") {
      icon = <FaPlay size={16} />;
      tooltip = "Show Live Demo";
    } else if (
      type === "github" ||
      (type === "project" && link.includes("github.com"))
    ) {
      icon = <FaGithub size={16} />;
      tooltip = "Go to Github Repo";
    } else if (type === "project") {
      icon = <FaLink size={16} />;
      tooltip = "View Project Link";
    } else if (type === "certificate") {
      icon = <FaCertificate size={16} />;
      tooltip = "View Certificate";
    }
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        title={tooltip}
        className="inline-flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/20 text-white rounded-full transition-colors"
      >
        {icon}
      </a>
    );
  };

  const typeColor =
    project.type === "project"
      ? "bg-color1 text-black"
      : "bg-teal-400 text-black";

  return (
    <div
      className={`fixed inset-0 flex justify-end z-100 transition-opacity duration-300 ease-in-out ${
        isVisible ? "bg-black/75 " : "pointer-events-none"
      }`}
      onClick={handleCloseRequest}
    >
      <div
        className={`w-full max-w-lg h-full bg-[#2a2a2a] text-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-color1">{project.title}</h2>
          <button
            onClick={handleCloseRequest}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="mb-6">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${typeColor}`}
          >
            {project.type}
          </span>
        </div>

        {project.imageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              draggable="false"
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {project.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-color2 mb-2">
              Description
            </h3>
            <p
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: project.description.replace(/\n/g, "<br />"),
              }}
            ></p>
          </div>
        )}

        {(project.githubUrl ||
          project.projectLink ||
          project.demoUrl ||
          project.demoLink ||
          project.certificateLink) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-color2 mb-3">Links</h3>
            <div className="flex gap-3">
              {project.type === "project" &&
                (project.githubUrl || project.projectLink) && (
                  <div>
                    {renderLinkIcon(
                      project.githubUrl || project.projectLink,
                      "github",
                    )}
                  </div>
                )}
              {project.type === "project" &&
                (project.demoUrl || project.demoLink) && (
                  <div>
                    {renderLinkIcon(
                      project.demoUrl || project.demoLink,
                      "demo",
                    )}
                  </div>
                )}
              {project.type === "certification" && project.certificateLink && (
                <div>
                  {renderLinkIcon(project.certificateLink, "certificate")}
                </div>
              )}
            </div>
          </div>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-color2 mb-2">
              Tech Stacks
            </h3>
            <div
              className="flex flex-wrap gap-0.5 select-none"
              draggable="false"
            >
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center text-black px-2 py-1 rounded-md"
                >
                  {iconDict[tech] && (
                    <img
                      src={iconDict[tech]}
                      alt={tech}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.type === "certification" && project.certificateInstitution && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-color2 mb-2">
              Issuing Institution
            </h3>
            <p className="text-gray-300">{project.certificateInstitution}</p>
          </div>
        )}

        <button
          onClick={handleCloseRequest}
          className="w-full px-6 py-3 bg-color1 text-black cursor-pointer rounded-md hover:bg-opacity-90 transition-colors font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
