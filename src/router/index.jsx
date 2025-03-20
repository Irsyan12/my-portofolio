import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import Home from "../Home";
import Login from "../admin/login";
import NotFoundPage from "../pages/404";
import Dashboard from "../admin/Dashboard";
import ExperiencesPage from "../admin/ExperiencesPage";
import ProjectsAdminPage from "../admin/ProjectsPage"; 

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
    },
    {
      path: "/admin/*",
      element: <Dashboard />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: "experiences",
          element: <ExperiencesPage />
        },
        {
          path: "projects",
          element: <ProjectsAdminPage />
        }
      ]
    },
    {
      path: "*",
      element: <NotFoundPage />,
    }

  ]
);

export default router;
