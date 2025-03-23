// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Projects = ({ limit = 8 }) => {
  const categories = ["All", "Projects", "Certification"];
  const [activeType, setActiveType] = useState("All");

  // Projects data
  const projectsData = [
    {
      id: 1,
      title: "AirCalling Landing Page Design",
      type: "Certification",
      image: "https://placehold.co/600x400?text=AirCalling+Landing+Page+Design",
    },
    {
      id: 2,
      title: "Business Landing Page Design",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Business+Landing+Page+Design",
    },
    {
      id: 3,
      title: "Ecom Web Page Design",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Ecom+Web+Page+Design",
    },
    {
      id: 4,
      title: "Portfolio Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Portfolio+Website",
    },
    {
      id: 5,
      title: "Landing Page for SaaS",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Landing+Page+for+SaaS",
    },
    {
      id: 6,
      title: "E-commerce Store",
      type: "Certification",
      image: "https://placehold.co/600x400?text=E-commerce+Store",
    },
    {
      id: 7,
      title: "Personal Blog",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Personal+Blog",
    },
    {
      id: 8,
      title: "Online Resume",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Online+Resume",
    },
    {
      id: 9,
      title: "Photography Portfolio",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Photography+Portfolio",
    },
    {
      id: 10,
      title: "Restaurant Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Restaurant+Website",
    },
    {
      id: 11,
      title: "Event Landing Page",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Event+Landing+Page",
    },
    {
      id: 12,
      title: "Fitness App Landing Page",
      type: "Projects",
      image: "https://placehold.co/600x400?text=Fitness+App+Landing+Page",
    },
    {
      id: 13,
      title: "Travel Agency Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Travel+Agency+Website",
    },
    {
      id: 14,
      title: "Real Estate Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Real+Estate+Website",
    },
    {
      id: 15,
      title: "Corporate Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Corporate+Website",
    },
    {
      id: 16,
      title: "Mobile App Landing Page",
      type: "Projects",
      image: "https://placehold.co/600x400?text=Mobile+App+Landing+Page",
    },
    {
      id: 17,
      title: "Blog Template",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Blog+Template",
    },
    {
      id: 18,
      title: "Shop Template",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Shop+Template",
    },
    {
      id: 19,
      title: "Portfolio Template",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Portfolio+Template",
    },
    {
      id: 20,
      title: "Landing Page for Non-Profit",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Landing+Page+for+Non-Profit",
    },
    {
      id: 21,
      title: "Product Showcase",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Product+Showcase",
    },
    {
      id: 22,
      title: "Fashion Store",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Fashion+Store",
    },
    {
      id: 23,
      title: "Tech Startup Landing Page",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Tech+Startup+Landing+Page",
    },
    {
      id: 24,
      title: "Consulting Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Consulting+Website",
    },
    {
      id: 25,
      title: "Online Course Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Online+Course+Website",
    },
    {
      id: 26,
      title: "Health & Wellness Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Health+%26+Wellness+Website",
    },
    {
      id: 27,
      title: "Music Band Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Music+Band+Website",
    },
    {
      id: 28,
      title: "Charity Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Charity+Website",
    },
    {
      id: 29,
      title: "Gaming Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Gaming+Website",
    },
    {
      id: 30,
      title: "Art Gallery Website",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Art+Gallery+Website",
    },
    {
      id: 31,
      title: "Blogging Platform",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Blogging+Platform",
    },
    {
      id: 32,
      title: "Online Store",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Online+Store",
    },
    {
      id: 33,
      title: "Digital Marketing Agency",
      type: "Certification",
      image: "https://placehold.co/600x400?text=Digital+Marketing+Agency",
    },
  ];

  const classColorforType = (type) => {
    switch (type) {
      case "Projects":
        return "bg-color1";
      case "Certification":
        return "bg-teal-400";
      default:
        return "bg-gray-500";
    }
  };

  // Filter projects based on active type
  const filteredProjects =
    activeType === "All"
      ? projectsData
      : projectsData.filter((project) => project.type === activeType);

  // Batasi jumlah proyek yang ditampilkan
  const displayedProjects = filteredProjects.slice(0, limit);

  return (
    <section
      className="py-20 w-11/12 md:w-5/6 mx-auto text-white"
      id="projects"
    >
      {/* Section Header */}
      <div className="text-center mb-12 cursor-default">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-color1">
          My Projects & Certifications
        </h2>
        <p className="text-text-gray-400 max-w-2xl mx-auto">
          Here are some of my projects and certifications that I have completed
          during my learning journey
        </p>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-6 py-2 rounded-full transition-colors 
              ${
                activeType === type
                  ? "bg-color1 text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition-colors"
          >
            {/* Project Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Project Info */}
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

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                className={`px-6 py-3 text-sm md:text-md ${classColorforType(
                  project.type
                )} text-black rounded-full transform -translate-y-4 group-hover:translate-y-0 transition-transform`}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* See More Button */}
      {projectsData.length > limit && (
        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-block px-8 py-3 bg-color1 text-black rounded-full hover:bg-opacity-90 animate-bounce transition-colors"
            onClick={() => window.scrollTo(0, 0)}
          >
            See More Projects
          </Link>
        </div>
      )}
    </section>
  );
};

export default Projects;
