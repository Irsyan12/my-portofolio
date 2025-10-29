import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";
import Experience from "../models/Experience.js";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Sample Projects
    const sampleProjects = [
      {
        type: "project",
        title: "Portfolio Website",
        description:
          "A modern, responsive portfolio website built with React and Node.js. Features include project showcases, contact forms, admin dashboard, and analytics.",
        shortDescription: "Modern portfolio website with React and Node.js",
        techStack: ["React", "Node.js", "MongoDB", "Express", "JWT"],
        images: [
          {
            url: "https://via.placeholder.com/800x600/4F46E5/white?text=Portfolio+Homepage",
            alt: "Portfolio homepage screenshot",
          },
        ],
        thumbnailImage:
          "https://via.placeholder.com/400x300/4F46E5/white?text=Portfolio",
        demoUrl: "https://portfolio-demo.com",
        githubUrl: "https://github.com/Irsyan12/my-portfolio",
        category: "web",
        status: "completed",
        featured: true,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-03-01"),
        isPublic: true,
        order: 1,
      },
      {
        type: "project",
        title: "E-Commerce Dashboard",
        description:
          "A comprehensive admin dashboard for e-commerce management with real-time analytics, inventory management, and order processing.",
        shortDescription: "E-commerce admin dashboard with analytics",
        techStack: ["React", "TypeScript", "Firebase", "Chart.js"],
        images: [
          {
            url: "https://via.placeholder.com/800x600/10B981/white?text=Dashboard",
            alt: "Dashboard screenshot",
          },
        ],
        thumbnailImage:
          "https://via.placeholder.com/400x300/10B981/white?text=Dashboard",
        demoUrl: "https://ecommerce-dashboard-demo.com",
        githubUrl: "https://github.com/Irsyan12/ecommerce-dashboard",
        category: "web",
        status: "completed",
        featured: true,
        startDate: new Date("2023-08-01"),
        endDate: new Date("2023-11-01"),
        isPublic: true,
        order: 2,
      },
      {
        type: "project",
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
        shortDescription:
          "Collaborative task management with real-time updates",
        techStack: ["Vue.js", "Laravel", "MySQL", "Socket.io"],
        images: [
          {
            url: "https://via.placeholder.com/800x600/F59E0B/white?text=Task+App",
            alt: "Task management app screenshot",
          },
        ],
        thumbnailImage:
          "https://via.placeholder.com/400x300/F59E0B/white?text=Tasks",
        demoUrl: "https://task-app-demo.com",
        githubUrl: "https://github.com/Irsyan12/task-management",
        category: "web",
        status: "completed",
        featured: false,
        startDate: new Date("2023-05-01"),
        endDate: new Date("2023-07-01"),
        isPublic: true,
        order: 3,
      },
    ];

    // Sample Experiences
    const sampleExperiences = [
      {
        title: "Senior Full Stack Developer",
        company: "Tech Innovators Ltd",
        location: "Jakarta, Indonesia",
        description:
          "Leading development of modern web applications and mentoring junior developers in a fast-paced startup environment.",
        responsibilities: [
          "Lead full-stack development using React, Node.js, and MongoDB",
          "Architect and implement scalable microservices",
          "Mentor team of 5 junior developers",
          "Code review and establish development best practices",
          "Collaborate with product and design teams",
        ],
        technologies: [
          "React",
          "Node.js",
          "MongoDB",
          "Docker",
          "AWS",
          "TypeScript",
        ],
        achievements: [
          "Improved application performance by 40% through optimization",
          "Led migration from monolith to microservices architecture",
          "Reduced deployment time by 60% with CI/CD implementation",
          "Successfully delivered 15+ projects on time and within budget",
        ],
        employmentType: "full-time",
        startDate: new Date("2023-01-01"),
        endDate: null,
        isCurrentRole: true,
        companyLogo: "https://via.placeholder.com/100x100/4F46E5/white?text=TI",
        companyWebsite: "https://techinnovators.com",
        order: 1,
      },
      {
        title: "Full Stack Developer",
        company: "Digital Solutions Agency",
        location: "Bandung, Indonesia",
        description:
          "Developed and maintained multiple client projects ranging from corporate websites to complex web applications.",
        responsibilities: [
          "Develop responsive web applications using modern frameworks",
          "Integrate third-party APIs and payment gateways",
          "Optimize applications for performance and SEO",
          "Collaborate with design team to implement pixel-perfect UIs",
          "Maintain and update existing client projects",
        ],
        technologies: [
          "Vue.js",
          "Laravel",
          "MySQL",
          "PHP",
          "JavaScript",
          "CSS3",
        ],
        achievements: [
          "Delivered 20+ successful client projects",
          "Improved client satisfaction scores by 25%",
          "Implemented automated testing reducing bugs by 50%",
          "Created reusable component library used across projects",
        ],
        employmentType: "full-time",
        startDate: new Date("2021-06-01"),
        endDate: new Date("2022-12-31"),
        isCurrentRole: false,
        companyLogo:
          "https://via.placeholder.com/100x100/10B981/white?text=DSA",
        companyWebsite: "https://digitalsolutions.com",
        order: 2,
      },
      {
        title: "Frontend Developer",
        company: "StartupXYZ",
        location: "Remote",
        description:
          "Focused on creating engaging user interfaces and improving user experience for a growing SaaS platform.",
        responsibilities: [
          "Build responsive and interactive user interfaces",
          "Implement modern CSS frameworks and methodologies",
          "Optimize frontend performance and loading times",
          "Collaborate with UX designers on user experience improvements",
          "Write clean, maintainable JavaScript code",
        ],
        technologies: ["React", "Redux", "SASS", "Webpack", "Jest", "Figma"],
        achievements: [
          "Reduced page load times by 35%",
          "Increased user engagement by 20%",
          "Implemented responsive design improving mobile usage",
          "Built component library used by entire development team",
        ],
        employmentType: "contract",
        startDate: new Date("2020-08-01"),
        endDate: new Date("2021-05-31"),
        isCurrentRole: false,
        companyLogo:
          "https://via.placeholder.com/100x100/F59E0B/white?text=SXY",
        companyWebsite: "https://startupxyz.com",
        order: 3,
      },
    ];

    // Clear existing data (optional - remove if you want to keep existing data)
    console.log("🧹 Clearing existing sample data...");
    await Project.deleteMany({
      title: { $in: sampleProjects.map((p) => p.title) },
    });
    await Experience.deleteMany({
      title: { $in: sampleExperiences.map((e) => e.title) },
    });

    // Insert sample projects
    console.log("📁 Seeding sample projects...");
    const createdProjects = await Project.insertMany(sampleProjects);
    console.log(`✅ Created ${createdProjects.length} sample projects`);

    // Insert sample experiences
    console.log("💼 Seeding sample experiences...");
    const createdExperiences = await Experience.insertMany(sampleExperiences);
    console.log(`✅ Created ${createdExperiences.length} sample experiences`);

    console.log("\n🎉 Sample data seeded successfully!");
    console.log("\nSample data includes:");
    console.log("- 3 Projects (2 featured, 1 regular)");
    console.log("- 3 Work experiences (1 current, 2 past)");
    console.log("\nYou can now test the API endpoints with this sample data.");
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
