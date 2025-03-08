import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import Home from "../Home";
import Login from "../admin/login";
import NotFoundPage from "../pages/404";

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
      path: "*",
      element: <NotFoundPage />,
    }

  ]
);

export default router;
