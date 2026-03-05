import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import HelloWorldPage from "./section/HelloWorldPage";
import Projects from "./section/Projects";
import AboutSections from "./section/AboutSections";
import ContactSection from "./section/ContactMe";
import Footer from "./section/Footer";
import CursorGlow from "./components/CursorGlow";
import ChatbotPopup from "./components/ChatbotPopup";
import FeedbackPopup from "./components/FeedbackPopup";
import { trackVisit, trackPageDuration } from "./utils/trackVisit";
import backgroundSvg from "./assets/background.svg";

function Home() {
  useEffect(() => {
    // Track visit to MongoDB
    trackVisit();

    // Track page duration
    const cleanupDuration = trackPageDuration();

    // Initialize AOS animations
    AOS.init({
      duration: 800, // durasi animasi default
      once: true, // animasi hanya sekali saat scroll
    });

    // Cleanup
    return () => {
      if (cleanupDuration) cleanupDuration();
    };
  }, []);

  return (
    <div
      className="relative font-poppins selection:bg-color1 selection:text-black overflow-x-hidden min-h-screen"
      style={{
        backgroundImage: `url(${backgroundSvg})`,
        backgroundSize: "auto",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* Dark overlay to make pattern subtle */}
      <div className="absolute inset-0 bg-dark/90 z-0 pointer-events-none" />

      {/* Cursor Glow Effect */}
      <div className="z-50 fixed top-0 left-0 w-full h-full pointer-events-none">
        <CursorGlow />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <HelloWorldPage />
        <AboutSections />
        <Projects />
        <ContactSection />
        <Footer />
      </div>

      {/* Floating Components */}
      <ChatbotPopup />
      <FeedbackPopup />
    </div>
  );
}

export default Home;
