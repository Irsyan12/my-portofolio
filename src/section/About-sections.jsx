// eslint-disable-next-line no-unused-vars
import React from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import TechStack from "../components/TechStack";

const AboutSection = () => {
  return (
    <section className="py-20 w-11/12 md:w-5/6 mx-auto text-white" id="about">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#c5f82a]">About Me</h2>
          <p className="text-lg text-gray-300">
            I am a passionate web developer with a strong foundation in modern
            web technologies. My journey in web development started 5 years ago,
            and I&apos;ve been creating meaningful digital experiences ever
            since.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#c5f82a]" />
              <span>irsyanramadhan72@gmail.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-[#c5f82a]" />
              <span>Banda Aceh, Indonesia</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-[#c5f82a]">5+</h3>
            <p>Years of Experience</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-[#c5f82a]">50+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-[#c5f82a]">20+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="bg-white/5 p-6 rounded-lg">
            <h3 className="text-2xl font-bold text-[#c5f82a]">10+</h3>
            <p>Awards Won</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const skills = [
    {
      category: "Frontend",
      items: ["React", "Tailwind CSS", "Bootsrap", "JavaScript", "TypeScript"],
    },
    { category: "Backend", items: ["Node.js", "Python", "PHP", "MySQL"] },
    { category: "Design", items: ["Figma", "Adobe Ilustrator"] },
    { category: "Tools", items: ["Git", "Firebase"] },
  ];

  return (
    <div className="mb-20">
      <section className="mt-20 w-11/12 md:w-5/6 mx-auto text-white ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#c5f82a]">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here are the technologies and tools I use to bring ideas to life
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup) => (
            <div
              key={skillGroup.category}
              className="p-6 rounded-lg bg-white/5"
            >
              <h3 className="text-xl font-bold mb-4 text-[#c5f82a]">
                {skillGroup.category}
              </h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill) => (
                  <li key={skill} className="flex items-center">
                    <div className="w-2 h-2 bg-[#c5f82a] rounded-full mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <TechStack />
    </div>
  );
};

const ExperienceSection = () => {
  const experiences = [
    {
      period: "2022 - Present",
      role: "Senior Frontend Developer",
      company: "Tech Company",
      description:
        "Leading frontend development team, implementing modern web technologies",
    },
    {
      period: "2020 - 2022",
      role: "Web Developer",
      company: "Digital Agency",
      description:
        "Developed responsive websites and web applications for clients",
    },
    {
      period: "2018 - 2020",
      role: "Junior Developer",
      company: "Startup",
      description:
        "Worked on various web development projects using React and Node.js",
    },
  ];

  return (
    <section className="py-20 w-11/12 md:w-5/6 mx-auto text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-[#c5f82a]">Experience</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          My professional journey in the tech industry
        </p>
      </div>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-8 p-6 rounded-lg bg-white/5"
          >
            <div className="md:w-1/4">
              <span className="text-[#c5f82a]">{exp.period}</span>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold mb-2">{exp.role}</h3>
              <h4 className="text-lg text-[#c5f82a] mb-4">{exp.company}</h4>
              <p className="text-gray-400">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};



const AboutSections = () => {
  return (
    <div className="bg-dark">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
    </div>
  );
};

export default AboutSections;
