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
} from "../src/firebase/firebase"; // Timestamp sekarang bisa digunakan langsung!
import Navbar from "./components/Navbar";
import HelloWorldPage from "./section/HelloWorldPage";
import Projects from "./section/Projects";
import AboutSections from "./section/About-sections";
import ContactSection from "./section/Contact-me";
import Footer from "./section/Footer";

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
  }, []);

  return (
    <div className="bg-dark font-poppins selection:bg-color1 selection:text-black">
      <Navbar />
      <HelloWorldPage />
      <AboutSections />
      <Projects />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default Home;
