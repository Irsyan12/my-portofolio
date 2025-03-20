import { useEffect } from "react";
import { analytics, logEvent, db, doc, getDoc, setDoc, updateDoc, increment } from "../src/firebase/firebase";
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

        // Simpan timestamp terakhir kunjungan
        localStorage.setItem("last_page_view", Date.now().toString());

        try {
          const visitRef = doc(db, "analytics", "website_visits");
          const visitSnap = await getDoc(visitRef);

          if (visitSnap.exists()) {
            await updateDoc(visitRef, {
              total_visits: increment(1),
            });
          } else {
            await setDoc(visitRef, { total_visits: 1 });
          }
          console.log("Total kunjungan diperbarui!");
        } catch (error) {
          console.error("Error memperbarui total kunjungan:", error);
        }

        // Hapus localStorage setelah 15 menit
        setTimeout(() => {
          localStorage.removeItem("last_page_view");
          console.log("Local storage last_page_view dihapus setelah 15 menit");
        }, 15 * 60 * 1000);
      }
    };

    updatePageView();
  }, []);

  return (
    <div className="bg-dark font-poppins">
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
