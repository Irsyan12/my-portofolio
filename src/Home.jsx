import Navbar from "./components/Navbar";
import HelloWorldPage from "./section/HelloWorldPage";
import Projects from "./section/Projects";
import AboutSections from "./section/About-sections";
import ContactSection from "./section/Contact-me";

function Home() {
  return (
    <div className="bg-dark font-poppins">
      <Navbar />
      <HelloWorldPage />
      <AboutSections />
      <Projects />
      <ContactSection />
    </div>
  );
}

export default Home;
