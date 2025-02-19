// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Projects = ({ limit = 3 }) => {
  const categories = ["All", "UI/UX", "Web Design", "App Design", "Graphic Design"];
  const [activeCategory, setActiveCategory] = useState("All");
  // const [currentIndex, setCurrentIndex] = useState(0);



  // Projects data
  const projectsData = [
    {
      id: 1,
      title: "AirCalling Landing Page Design",
      category: "Web Design",
      image: "/images/projects/project1.png",
    },
    {
      id: 2,
      title: "Business Landing Page Design",
      category: "Web Design",
      image: "/images/projects/project2.png",
    },
    {
      id: 3,
      title: "Ecom Web Page Design",
      category: "Web Design",
      image: "/images/projects/project3.png",
    },
    {
      id: 4,
      title: "Portfolio Website",
      category: "Web Design",
      image: "/images/projects/project4.png",
    },
    {
      id: 5,
      title: "Landing Page for SaaS",
      category: "Web Design",
      image: "/images/projects/project5.png",
    },
    {
      id: 6,
      title: "E-commerce Store",
      category: "Web Design",
      image: "/images/projects/project6.png",
    },
    {
      id: 7,
      title: "Personal Blog",
      category: "Web Design",
      image: "/images/projects/project7.png",
    },
    {
      id: 8,
      title: "Online Resume",
      category: "Web Design",
      image: "/images/projects/project8.png",
    },
    {
      id: 9,
      title: "Photography Portfolio",
      category: "Web Design",
      image: "/images/projects/project9.png",
    },
    {
      id: 10,
      title: "Restaurant Website",
      category: "Web Design",
      image: "/images/projects/project10.png",
    },
    {
      id: 11,
      title: "Event Landing Page",
      category: "Web Design",
      image: "/images/projects/project11.png",
    },
    {
      id: 12,
      title: "Fitness App Landing Page",
      category: "App Design",
      image: "/images/projects/project12.png",
    },
    {
      id: 13,
      title: "Travel Agency Website",
      category: "Web Design",
      image: "/images/projects/project13.png",
    },
    {
      id: 14,
      title: "Real Estate Website",
      category: "Web Design",
      image: "/images/projects/project14.png",
    },
    {
      id: 15,
      title: "Corporate Website",
      category: "Web Design",
      image: "/images/projects/project15.png",
    },
    {
      id: 16,
      title: "Mobile App Landing Page",
      category: "App Design",
      image: "/images/projects/project16.png",
    },
    {
      id: 17,
      title: "Blog Template",
      category: "Web Design",
      image: "/images/projects/project17.png",
    },
    {
      id: 18,
      title: "Shop Template",
      category: "Web Design",
      image: "/images/projects/project18.png",
    },
    {
      id: 19,
      title: "Portfolio Template",
      category: "Web Design",
      image: "/images/projects/project19.png",
    },
    {
      id: 20,
      title: "Landing Page for Non-Profit",
      category: "Web Design",
      image: "/images/projects/project20.png",
    },
    {
      id: 21,
      title: "Product Showcase",
      category: "Web Design",
      image: "/images/projects/project21.png",
    },
    {
      id: 22,
      title: "Fashion Store",
      category: "Web Design",
      image: "/images/projects/project22.png",
    },
    {
      id: 23,
      title: "Tech Startup Landing Page",
      category: "Web Design",
      image: "/images/projects/project23.png",
    },
    {
      id: 24,
      title: "Consulting Website",
      category: "Web Design",
      image: "/images/projects/project24.png",
    },
    {
      id: 25,
      title: "Online Course Website",
      category: "Web Design",
      image: "/images/projects/project25.png",
    },
    {
      id: 26,
      title: "Health & Wellness Website",
      category: "Web Design",
      image: "/images/projects/project26.png",
    },
    {
      id: 27,
      title: "Music Band Website",
      category: "Web Design",
      image: "/images/projects/project27.png",
    },
    {
      id: 28,
      title: "Charity Website",
      category: "Web Design",
      image: "/images/projects/project28.png",
    },
    {
      id: 29,
      title: "Gaming Website",
      category: "Web Design",
      image: "/images/projects/project29.png",
    },
    {
      id: 30,
      title: "Art Gallery Website",
      category: "Web Design",
      image: "/images/projects/project30.png",
    },
    {
      id: 31,
      title: "Blogging Platform",
      category: "Web Design",
      image: "/images/projects/project31.png",
    },
    {
      id: 32,
      title: "Online Store",
      category: "Web Design",
      image: "/images/projects/project32.png",
    },
    {
      id: 33,
      title: "Digital Marketing Agency",
      category: "Web Design",
      image: "/images/projects/project33.png",
    },

    // Add more projects as needed
  ];

  // Filter projects based on active category
  const filteredProjects = activeCategory === "All"
    ? projectsData
    : projectsData.filter(project => project.category === activeCategory);

    // Batasi jumlah proyek yang ditampilkan
  const displayedProjects = filteredProjects.slice(0, limit);

  return (
    <section className="py-20 w-11/12 md:w-5/6 mx-auto text-white">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">My Projects</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur. Mollis erat duis aliquam mauris est risus
          lectus. Phasellus consequat urna tellus
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full transition-colors 
              ${activeCategory === category
                ? "bg-primary text-black"
                : "bg-white/10 hover:bg-white/20"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <span className="text-primary text-sm">{project.category}</span>
              <h3 className="text-xl font-semibold mt-2">{project.title}</h3>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="px-6 py-3 bg-primary text-black rounded-full transform -translate-y-4 group-hover:translate-y-0 transition-transform">
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
            className="inline-block px-8 py-3 bg-primary text-black rounded-full hover:bg-opacity-90 transition-colors"
          >
            See More Projects
          </Link>
        </div>
      )}
    </section>
  );
};

export default Projects;
