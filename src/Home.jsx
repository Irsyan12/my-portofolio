import Navbar from "./components/Navbar";
import HelloWorldPage from "./section/HelloWorldPage";
import TechStack from "./components/TechStack";
import Projects from "./section/Projects";

function Home() {
  return (
    <div className="bg-dark font-poppins">
      <Navbar />
      <HelloWorldPage />
      <TechStack />
      <Projects />
    </div>
  );
}

export default Home;
