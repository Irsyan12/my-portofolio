import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import HelloWorldPage from "./section/HelloWorldPage";
import Projects from "./section/Projects";
import AboutSections from "./section/About-sections";
import ContactSection from "./section/Contact-me";
import Footer from "./section/Footer";
import CursorGlow from "./components/CursorGlow";
import ChatbotPopup from "./components/ChatbotPopup";
import FeedbackPopup from "./components/FeedbackPopup";
import { trackVisit, trackPageDuration } from "./utils/trackVisit";

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
    <div className="bg-dark font-poppins selection:bg-color1 selection:text-black overflow-x-hidden">
      <div className="z-50 fixed top-0 left-0 w-full h-full pointer-events-none">
        <CursorGlow />
      </div>
      <Navbar />
      <HelloWorldPage />
      <AboutSections />
      <Projects />
      <ContactSection />
      <Footer />
      <ChatbotPopup />
      <FeedbackPopup />
    </div>
  );
}

export default Home;
