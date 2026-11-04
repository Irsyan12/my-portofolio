import { useState, useEffect, lazy, Suspense } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import HeroSection from "./section/HeroSection";
import AboutSection from "./section/AboutSection";
import ExperienceSection from "./section/ExperienceSection";
import TechSkillsSection from "./section/TechSkillsSection";
import ProjectsSection from "./section/ProjectsSection";
import ContactSection from "./section/ContactSection";
import Footer from "./section/Footer";
import CursorGlow from "./components/CursorGlow";
import HackerLoadingScreen from "./components/HackerLoadingScreen";
import { trackVisit, trackPageDuration } from "./utils/trackVisit";
import { projectsAPI, experiencesAPI } from "./api";

// Lazy load secondary components (Fase 2 - ACT-14)
const ChatbotPopup = lazy(() => import("./components/ChatbotPopup"));
const FeedbackPopup = lazy(() => import("./components/FeedbackPopup"));

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  const handleSkip = () => {
    setIsLoading(false);
    setShowLoadingScreen(false);
    AOS.refresh();
  };

  useEffect(() => {
    // 1. Start analytics and AOS
    trackVisit();
    const cleanupDuration = trackPageDuration();
    AOS.init({ duration: 800, once: true });

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsLoading(false);
      setShowLoadingScreen(false);
      return;
    }

    // 2. Dynamic loading: load essential content with a safety timeout of 5 seconds (ACT-09)
    const initializeApp = async () => {
      try {
        const promises = Promise.allSettled([
          projectsAPI.getAll(),
          experiencesAPI.getAll(),
          new Promise((resolve) => {
            const img = new Image();
            img.src =
              "https://res.cloudinary.com/dxwmph7tj/image/upload/f_auto,q_auto,w_800/v1783964240/myfoto2_dzdqo4.png";
            img.onload = resolve;
            img.onerror = resolve;
          }),
        ]);

        // Race between content completion and 5s max safety timeout
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(resolve, 5000)
        );

        await Promise.race([promises, timeoutPromise]);
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);

        // Clean unmount of loading screen after slide-up finishes
        setTimeout(() => {
          setShowLoadingScreen(false);
          AOS.refresh();
        }, 800);
      }
    };

    initializeApp();

    // Cleanup
    return () => {
      if (cleanupDuration) cleanupDuration();
    };
  }, []);

  return (
    <div
      className={`min-h-screen relative selection:bg-amber-500 selection:text-black bg-darkBg text-gray-200 overflow-x-hidden ${
        isLoading ? "h-screen overflow-y-hidden" : ""
      }`}
    >
      {/* Loading screen rendered in the background */}
      {showLoadingScreen && <HackerLoadingScreen onSkip={handleSkip} />}

      {/* Main Content Sliding Up */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ y: "100vh" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="relative z-50 bg-darkBg min-h-screen shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Ambient Glow Effects */}
            <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed top-1/3 left-10 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            {/* Cursor Glow Effect */}
            <div className="z-50 fixed top-0 left-0 w-full h-full pointer-events-none">
              <CursorGlow />
            </div>

            {/* Main Layout */}
            <div className="relative z-10">
              {/* Skip to Content for Keyboard Accessibility (ACT-20) */}
              <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:font-bold focus:rounded-lg focus:shadow-2xl focus:outline-none"
              >
                Skip to content
              </a>

              <Navbar />

              <HeroSection />

              <main
                id="content"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left Column (Span 5) */}
                <div className="lg:col-span-5 space-y-8">
                  <AboutSection />
                  <ExperienceSection />
                </div>

                {/* Right Column (Span 7) */}
                <div className="lg:col-span-7 space-y-8">
                  <TechSkillsSection />
                  <ProjectsSection />
                  <ContactSection />
                </div>
              </main>

              <Footer />
            </div>

            {/* Floating Components (Lazy Loaded) */}
            <Suspense fallback={null}>
              <ChatbotPopup />
              <FeedbackPopup />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
