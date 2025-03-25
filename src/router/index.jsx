import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import Home from "../Home";
import Login from "../admin/Login";
import NotFoundPage from "../pages/404";
import Dashboard from "../admin/Dashboard";
import ExperiencesPage from "../admin/ExperiencesPage";
import ProjectsAdminPage from "../admin/ProjectsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../admin/DashboardLayout";
import MessagesPage from "../admin/MessagesPage";

const router = createBrowserRouter([
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
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "experiences",
            element: <ExperiencesPage />,
          },
          {
            path: "projects",
            element: <ProjectsAdminPage />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          }
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
