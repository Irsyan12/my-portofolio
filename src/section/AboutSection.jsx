import React from "react";
import { motion } from "framer-motion";
import GitHubContributionCard from "../components/GitHubContributionCard";
import SocialStackCarousel from "../components/SocialStackCarousel";
import { RiVipDiamondFill, RiFileDownloadLine } from "react-icons/ri";

const AboutSection = () => {
  return (
    <motion.div
      className="space-y-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {/* ABOUT ME */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 border-b border-neutral-800/50 pb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">About Me</h2>
            <p className="text-neutral-400 text-sm font-medium tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Full-Stack & Mobile Developer
            </p>
          </div>
          <a
            href="/cv.pdf"
            download="Irsyan_Ramadhan_CV.pdf"
            target="_blank"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 transition-all duration-300 overflow-hidden w-fit"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <RiFileDownloadLine className="text-amber-500 text-lg transition-transform group-hover:-translate-y-0.5" />
            <span>Download CV</span>
          </a>
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

        {/* Stack Carousel (Social Media) */}
        <SocialStackCarousel />
      </motion.div>

      {/* EDUCATION */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
        }}
      >
        <h2 className="font-serif text-3xl font-bold text-white mb-6">
          Education
        </h2>
        <div className="space-y-6 relative">
          <div className="flex items-start gap-4 relative">
            <RiVipDiamondFill className="text-amber-500 py-1 z-10 text-base flex-shrink-0 mt-0.5" />
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
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;
