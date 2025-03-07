import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import Home from "../Home";
import Login from "../admin/login";

const isGitHubPages = window.location.hostname.includes("github.io");
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/projects",
      element: <ProjectsPage />,
    },
    {
      path: "/login",
      element: <Login />,
    }
  ],
  {
    basename: isGitHubPages ? "/portofolio-irsyan" : "/",
  }
);

export default router;
