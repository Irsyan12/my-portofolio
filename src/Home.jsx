import { useEffect } from "react";
import {
  analytics,
  logEvent,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  Timestamp,
} from "../src/firebase/firebase";
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

function Home() {
  useEffect(() => {
    const updatePageView = async () => {
      const lastVisit = localStorage.getItem("last_page_view");

      if (!lastVisit || Date.now() - parseInt(lastVisit) > 15 * 60 * 1000) {
        logEvent(analytics, "page_view");
        logEvent(analytics, "page_view_increment");

        // Simpan timestamp terakhir kunjungan ke localStorage
        localStorage.setItem("last_page_view", Date.now().toString());

        try {
          const visitRef = doc(db, "analytics", "website_visits");
          const visitSnap = await getDoc(visitRef);

          const currentTime = Timestamp.now();

          if (visitSnap.exists()) {
            await updateDoc(visitRef, {
              total_visits: increment(1),
              timestamps: arrayUnion(currentTime),
            });
          } else {
            await setDoc(visitRef, {
              total_visits: 1,
              timestamps: [currentTime],
            });
          }
          console.log("Total kunjungan dan timestamps diperbarui!");
        } catch (error) {
          console.error("Error memperbarui total kunjungan:", error);
        }

        // Hapus localStorage setelah 15 menit
        setTimeout(() => {
          localStorage.removeItem("last_page_view");
        }, 15 * 60 * 1000);
      }
    };

    updatePageView();

    AOS.init({
      duration: 800, // durasi animasi default
      once: true, // animasi hanya sekali saat scroll
    });
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
      {/* <ChatbotPopup /> */}
    </div>
  );
}

export default Home;
