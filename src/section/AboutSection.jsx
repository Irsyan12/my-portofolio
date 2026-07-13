import React from "react";
import GitHubContributionCard from "../components/GitHubContributionCard";

const AboutSection = () => {
  return (
    <div className="space-y-8">
      {/* ABOUT ME CARD */}
      <div
        className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        data-aos="fade-up"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-serif text-3xl font-bold text-white">About Me</h2>
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 glow-orange">
            Mobile Developer (Flutter)
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href="/cv.pdf"
            download="Irsyan_Ramadhan_CV.pdf"
            target="_blank"
            className="px-5 py-2 rounded-full text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition flex items-center gap-2"
          >
            <i className="ri-download-line"></i> Download CV
          </a>
          <span className="px-5 py-2 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 glow-green">
            Full-Stack Developer
          </span>
        </div>

        <p className="text-neutral-300 text-sm leading-relaxed mb-6">
          Hi! I'm a passionate Computer Engineering fresh graduate from Syiah
          Kuala University, driven by curiosity and a love for building
          impactful digital solutions. I thrive at the intersection of{" "}
          <strong className="text-white font-semibold">
            Machine Learning, Web Development,
          </strong>{" "}
          and{" "}
          <strong className="text-white font-semibold">
            Mobile Development
          </strong>
          . I enjoy solving real-world problems and continuously exploring new
          technologies.
        </p>

        {/* GitHub Contribution Graph */}
        <GitHubContributionCard monthsToShow={6} username="Irsyan12" />
      </div>

      {/* EDUCATION SECTION */}
      <div
        className="bg-cardBg border border-cardBorder rounded-3xl p-6 sm:p-8"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <h2 className="font-serif text-3xl font-bold text-white mb-6">
          Education
        </h2>
        <div className="space-y-6 relative ">
          <div className="flex items-start gap-4 relative">
            <i className="ri-diamond-fill text-amber-500 bg-cardBg py-1 z-10 text-base"></i>
            <div>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                2021 - 2025
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Bachelor of Computer Engineering
              </h3>
              <p className="text-xs text-neutral-400">Syiah Kuala University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
