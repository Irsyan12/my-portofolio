import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";
import Home from "../Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
]);

export default router;