import React, { useState, useEffect } from "react";
import { experiencesAPI } from "../api";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchWithRetry(
          async () => {
            const res = await experiencesAPI.getAll();
            if (!res.success) throw new Error("Failed to fetch experiences");
            return res;
          },
          { retryDelay: 3000, timeout: 60000 }
        );

        const sortedExperiences = response.data.sort((a, b) => {
          const orderA = typeof a.order === "number" ? a.order : -Infinity;
          const orderB = typeof b.order === "number" ? b.order : -Infinity;
          return orderB - orderA;
        });
        setExperiences(sortedExperiences);
      } catch (err) {
        console.error("Error loading experiences:", err);
        setError("Failed to load experiences. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    loadExperiences();
  }, []);

  return (
    <div
      className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">Experience</h2>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-neutral-800">
        {isLoading ? (
          <div className="flex items-start gap-5 relative">
            <div className="w-6 h-6 rounded-full bg-neutral-800 border-4 border-cardBg z-10 flex-shrink-0 animate-pulse"></div>
            <div className="w-full">
              <div className="h-4 bg-neutral-800 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-5 bg-neutral-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : experiences.length === 0 ? (
          <div className="text-neutral-400 text-sm">No experiences listed yet.</div>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp.id || index} className="flex items-start gap-4 sm:gap-6 relative group">
              {/* Dot */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cardBg border-2 border-emerald-500 z-10 flex-shrink-0 mt-1 transition-all group-hover:bg-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1 block">
                  {exp.period}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {exp.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-400 font-medium mb-3 mt-1">
                  {exp.company}
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExperienceSection;
