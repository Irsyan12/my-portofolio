// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaRedoAlt,
  FaGithub,
} from "react-icons/fa";
import TechStack from "../components/TechStack";
import { experiencesAPI } from "../api";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const AboutSection = () => {
  const quotes = [
    "Consistency beats intensity when building a meaningful career.",
    "Small improvements every day create extraordinary results over time.",
    "Discipline turns your goals into real, visible progress.",
    "Stay curious, keep shipping, and let your work speak for itself.",
  ];

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const quoteStepRefs = useRef([]);
  const [contributions, setContributions] = useState([]);
  const [isContributionLoading, setIsContributionLoading] = useState(true);
  const [contributionError, setContributionError] = useState("");
  const CELL_SIZE = 7;
  const CELL_GAP = 1;

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsContributionLoading(true);
        setContributionError("");

        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/Irsyan12",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contribution data");
        }

        const data = await response.json();
        setContributions(
          Array.isArray(data.contributions) ? data.contributions : [],
        );
      } catch (error) {
        console.error("Contribution API Error:", error);
        setContributionError("Contribution graph is unavailable right now.");
      } finally {
        setIsContributionLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const contributionWeeks = useMemo(() => {
    if (!contributions.length) return [];

    const normalized = [...contributions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const contributionMap = new Map(
      normalized.map((item) => [item.date, item]),
    );

    const start = new Date(normalized[0].date);
    while (start.getDay() !== 0) {
      start.setDate(start.getDate() - 1);
    }

    const end = new Date(normalized[normalized.length - 1].date);
    while (end.getDay() !== 6) {
      end.setDate(end.getDate() + 1);
    }

    const weeks = [];
    const current = new Date(start);

    while (current <= end) {
      const week = [];
      for (let day = 0; day < 7; day += 1) {
        const dateKey = current.toISOString().split("T")[0];
        week.push(contributionMap.get(dateKey) || null);
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  }, [contributions]);

  const monthLabels = useMemo(() => {
    let previousMonth = "";

    return contributionWeeks.map((week) => {
      const firstDay = week.find(Boolean);
      if (!firstDay) return "";

      const month = new Date(firstDay.date).toLocaleDateString("en-US", {
        month: "short",
      });

      if (month !== previousMonth) {
        previousMonth = month;
        return month;
      }

      return "";
    });
  }, [contributionWeeks]);

  const formatTooltipDate = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelClass = (level) => {
    const levelMap = {
      0: "bg-[#2d333b]",
      1: "bg-[#0e4429]",
      2: "bg-[#006d32]",
      3: "bg-[#26a641]",
      4: "bg-[#39d353]",
    };

    return levelMap[level] || levelMap[0];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (!Number.isNaN(index)) {
              setActiveQuoteIndex(index);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
        rootMargin: "-25% 0px -25% 0px",
      },
    );

    quoteStepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
            Hi! I'm a passionate Computer Engineering fresh graduate from Syiah
            Kuala University, driven by curiosity and a love for building
            impactful digital solutions. I thrive at the intersection of{" "}
            <span className="text-color1 font-semibold">Machine Learning</span>,{" "}
            <span className="text-color1 font-semibold">Web Development</span>,
            and{" "}
            <span className="text-color1 font-semibold">
              Mobile Development
            </span>
            . I enjoy solving real-world problems and continuously exploring new
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
              className="bg-gray-800 p-7 rounded-xl hover:shadow-color1/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm border border-white/10"
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
      <div
        className="mt-16 grid lg:grid-cols-2 gap-8 items-start"
        data-aos="fade-up"
        data-aos-delay={300}
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://github.com/Irsyan12.png"
                alt="Irsyan Ramadhan GitHub avatar"
                className="w-12 h-12 rounded-full border border-white/20 object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-xs text-gray-300">@Irsyan12</p>
              </div>
            </div>
            <FaGithub className="text-xl text-gray-200" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
              Contribution Graph
            </p>
            <span className="text-xs text-gray-300">Last 12 months</span>
          </div>
          {isContributionLoading ? (
            <div className="h-[130px] rounded-xl border border-white/10 bg-white/5 animate-pulse" />
          ) : contributionError ? (
            <div className="h-[130px] rounded-xl border border-red-400/30 bg-red-400/10 text-red-200 text-sm flex items-center justify-center px-4 text-center">
              {contributionError}
            </div>
          ) : (
            <div className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div
                className="relative mb-2 min-w-max h-3"
                style={{
                  width: `${contributionWeeks.length * (CELL_SIZE + CELL_GAP)}px`,
                }}
              >
                {monthLabels.map((label, index) =>
                  label ? (
                    <span
                      key={`${label}-${index}`}
                      className="absolute text-[9px] leading-none text-gray-400"
                      style={{
                        left: `${index * (CELL_SIZE + CELL_GAP)}px`,
                      }}
                    >
                      {label}
                    </span>
                  ) : null,
                )}
              </div>

              <div className="inline-flex gap-[1px] min-w-max">
                {contributionWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-rows-7 gap-[1px]">
                    {week.map((day, dayIndex) => {
                      const levelClass = day
                        ? getLevelClass(day.level)
                        : "bg-transparent";
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className="relative group"
                        >
                          <div
                            className={`rounded-[2px] border border-white/5 ${levelClass}`}
                            style={{
                              width: `${CELL_SIZE}px`,
                              height: `${CELL_SIZE}px`,
                            }}
                          />
                          {day ? (
                            <div className="pointer-events-none absolute bottom-[120%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-20">
                              {day.count} contributions on{" "}
                              {formatTooltipDate(day.date)}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-gray-300">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`rounded-[2px] border border-white/10 ${getLevelClass(level)}`}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="sticky top-24 p-6 min-h-[220px] flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                Inspiration
              </p>
              <div className="relative min-h-[90px]">
                {quotes.map((quote, idx) => (
                  <p
                    key={quote}
                    className={`absolute inset-0 text-gray-100 text-base leading-relaxed italic transition-all duration-700 ease-out ${
                      activeQuoteIndex === idx
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3"
                    }`}
                  >
                    "{quote}"
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {quotes.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeQuoteIndex === idx
                      ? "w-8 bg-color1"
                      : "w-3 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-6" aria-hidden="true">
            {quotes.map((_, index) => (
              <div
                key={index}
                ref={(el) => {
                  quoteStepRefs.current[index] = el;
                }}
                data-index={index}
                className="h-20"
              />
            ))}
          </div>
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

        // Fetch with retry logic - will retry for 1 minute
        const response = await fetchWithRetry(
          async () => {
            const res = await experiencesAPI.getAll();
            if (!res.success) {
              throw new Error("Failed to fetch experiences");
            }
            return res;
          },
          {
            retryDelay: 3000, // 3 seconds between retries
            timeout: 60000, // 1 minute total
          },
        );

        // Sort experiences by 'order' in descending order (highest order first)
        const sortedExperiences = response.data.sort((a, b) => {
          const orderA = typeof a.order === "number" ? a.order : -Infinity;
          const orderB = typeof b.order === "number" ? b.order : -Infinity;
          return orderB - orderA;
        });
        setExperiences(sortedExperiences);
        console.log("Experiences loaded:", sortedExperiences);
      } catch (err) {
        console.error("Error loading experiences for public page:", err);
        setError(
          "Failed to load experiences after multiple attempts. Please refresh the page.",
        );
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
        <div className="relative">
          {/* Vertical timeline line for skeleton */}
          <div className="absolute left-4 md:left-1/4 ml-1 top-2 bottom-2 w-1 bg-color1/30 hidden md:block"></div>

          <div className="space-y-6 relative">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-10 relative animate-pulse"
              >
                <div className="md:w-1/4 flex items-center md:items-start md:justify-end">
                  <div className="absolute left-0 md:left-1/4 w-8 h-8 rounded-full bg-color1/30 -ml-3 mt-1 hidden md:flex" />
                  <div className="w-6 h-6 rounded-full bg-color1/30 mr-4 md:hidden" />
                  <div className="bg-white/10 h-8 rounded-full w-32" />
                </div>
                <div className="md:w-3/5 bg-white/5 p-6 rounded-lg border border-white/10">
                  <div className="h-6 bg-white/20 rounded w-2/3 mb-3" />
                  <div className="h-5 bg-color1/20 rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400/20 rounded w-full" />
                    <div className="h-4 bg-gray-400/20 rounded w-5/6" />
                    <div className="h-4 bg-gray-400/20 rounded w-4/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator text */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-color1 border-t-transparent rounded-full animate-spin" />
              <span>Loading experiences... Please wait</span>
            </div>
          </div>
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
                    "Failed to load experiences. Please try again later.",
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
    <div className="">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
    </div>
  );
};

export default AboutSections;
