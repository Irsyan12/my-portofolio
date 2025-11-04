// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaRedoAlt } from "react-icons/fa";
import TechStack from "../components/TechStack";
import { experiencesAPI } from "../api";

const AboutSection = () => {
  return (
    <section
      className="py-24 w-11/12 md:w-5/6 mx-auto text-white cursor-default"
      id="about"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Left: About Me */}
        <div className="space-y-7" data-aos="fade-right" data-aos-delay="100">
          <h2 className="text-3xl md:text-4xl font-extrabold text-color1 mb-2">
            About Me
          </h2>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Hi! I'm a passionate Computer Engineering student at Syiah Kuala
            University, driven by curiosity and a love for building impactful
            digital solutions. I thrive at the intersection of{" "}
            <span className="text-color1 font-semibold">Machine Learning</span>,{" "}
            <span className="text-color1 font-semibold">Web</span>, and{" "}
            <span className="text-color1 font-semibold">
              Mobile Development
            </span>
            . I enjoy solving real-world problems and continuously learning new
            technologies.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-color1" />
              <a
                href="mailto:irsyanramadhan72@gmail.com"
                className="text-sm md:text-base hover:underline"
              >
                irsyanramadhan72@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-color1" />
              <span className="text-sm md:text-base">
                Banda Aceh, Indonesia
              </span>
            </div>
          </div>
        </div>
        {/* Right: Highlights */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { title: "ML", desc: "Machine Learning Specialist", delay: 10 },
            { title: "Web", desc: "Full-Stack Developer", delay: 100 },
            { title: "Mobile", desc: "App Development", delay: 150 },
            { title: "10+", desc: "Tech Certifications", delay: 200 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 p-7 rounded-xl hover:shadow-color1/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm border border-white/10"
              data-aos="zoom-in"
              data-aos-delay={item.delay}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-color1 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-200 text-sm md:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const skills = [
    {
      category: "Frontend",
      items: ["React", "Tailwind CSS", "Bootsrap", "JavaScript", "TypeScript"],
    },
    { category: "Backend", items: ["Node.js", "Python", "PHP"] },
    { category: "Design", items: ["Figma", "Adobe Ilustrator"] },
    { category: "Tools", items: ["Git", "Firebase"] },
  ];

  return (
    <div className="mb-20 cursor-default">
      <section
        className="mt-20 w-11/12 md:w-5/6 mx-auto text-white"
        data-aos="fade-up"
        data-aos-duration="500"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-color1">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here are the technologies and tools I use to bring ideas to life
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-default">
          {skills.map((skillGroup, i) => (
            <div
              key={skillGroup.category}
              className="p-6 rounded-lg bg-white/5 hover:shadow-color1/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <h3 className="text-xl font-bold mb-4 text-color1">
                {skillGroup.category}
              </h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill) => (
                  <li key={skill} className="flex items-center">
                    <div className="w-2 h-2 bg-color1 rounded-full mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <TechStack />
    </div>
  );
};

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await experiencesAPI.getAll();
        if (response.success) {
          // Sort experiences by 'order' in descending order (highest order first)
          const sortedExperiences = response.data.sort((a, b) => {
            const orderA = typeof a.order === "number" ? a.order : -Infinity;
            const orderB = typeof b.order === "number" ? b.order : -Infinity;
            return orderB - orderA;
          });
          setExperiences(sortedExperiences);
        }
      } catch (err) {
        console.error("Error loading experiences for public page:", err);
        setError("Failed to load experiences. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadExperiences();
  }, []);

  return (
    <section
      className="py-20 w-11/12 md:w-5/6 cursor-default mx-auto text-white"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-color1">
          Experience
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          My professional journey in the tech industry
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-10 relative animate-pulse"
            >
              <div className="md:w-1/4 flex items-center md:items-start md:justify-end">
                <div className="sm:absolute left-0 md:left-1/4 w-8 h-8 rounded-full bg-color1/30 -ml-3 mt-1 hidden md:hidden" />
                <div className="w-6 h-6 rounded-full bg-color1/30 mr-4 md:flex" />
                <span className="bg-white/10 text-transparent px-4 py-2 rounded-full w-24 h-6 block" />
              </div>
              <div className="md:w-3/5 bg-white/10 p-6 rounded-lg">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-2" />
                <div className="h-5 bg-color1/20 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-400/20 rounded w-full mb-1" />
                <div className="h-4 bg-gray-400/20 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-md">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Re-fetch experiences
              experiencesAPI
                .getAll()
                .then((response) => {
                  if (response.success) {
                    const sortedExperiences = response.data.sort((a, b) => {
                      const orderA =
                        typeof a.order === "number" ? a.order : -Infinity;
                      const orderB =
                        typeof b.order === "number" ? b.order : -Infinity;
                      return orderB - orderA;
                    });
                    setExperiences(sortedExperiences);
                  }
                })
                .catch((err) => {
                  console.error("Error reloading experiences:", err);
                  setError(
                    "Failed to load experiences. Please try again later."
                  );
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            className="flex items-center gap-2 mx-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <FaRedoAlt className="text-sm" />
          </button>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center text-gray-400">
          No professional experiences listed yet.
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 md:left-1/4 ml-1 top-2 bottom-2 w-1 bg-color1/30 hidden md:block"></div>

          <div className="space-y-6 relative">
            {experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="flex flex-col md:flex-row gap-10 relative"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="md:w-1/4 flex items-center md:items-start md:justify-end">
                  <div className="absolute left-0 md:left-1/4 w-8 h-8 rounded-full bg-color1 items-center justify-center -ml-3 mt-1 shadow-lg shadow-color1/20 hidden md:flex">
                    <div className="w-3 h-3 bg-dark rounded-full"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-color1 flex items-center justify-center mr-4 shadow-lg shadow-color1/20 md:hidden">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <span className="text-color1 md:me-10 font-medium bg-white/5 px-4 py-2 rounded-full hover:shadow-color1/10 hover:shadow-md transition-all duration-300 hover:-translate-y-1 backdrop-blur-xs border border-white/5">
                    {exp.period}
                  </span>
                </div>
                <div className="md:w-3/5 bg-white/5 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-color1/10 hover:shadow-lg hover:-translate-y-1 backdrop-blur-xs border border-white/10">
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <h4 className="text-lg text-color1 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-color1 rounded-full inline-block"></span>
                    {exp.company}
                  </h4>
                  <p className="text-gray-400">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const AboutSections = () => {
  return (
    <div className="bg-dark">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
    </div>
  );
};

export default AboutSections;
