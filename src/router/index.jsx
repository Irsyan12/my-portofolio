import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Home";

// Route-based code splitting for admin & error pages (Fase 2 - ACT-13)
const Login = lazy(() => import("../admin/Login"));
const NotFoundPage = lazy(() => import("../pages/404"));
const Dashboard = lazy(() => import("../admin/Dashboard"));
const ExperiencesPage = lazy(() => import("../admin/ExperiencesPage"));
const ProjectsAdminPage = lazy(() => import("../admin/ProjectsPage"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute"));
const DashboardLayout = lazy(() => import("../admin/DashboardLayout"));
const MessagesPage = lazy(() => import("../admin/MessagesPage"));
const FeedbackPage = lazy(() => import("../admin/FeedbackPage"));

const RouteSuspense = ({ children }) => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-amber-500 font-mono text-sm">
        <span className="animate-pulse">Loading...</span>
      </div>
    }
  >
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <RouteSuspense>
        <Login />
      </RouteSuspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <RouteSuspense>
        <ProtectedRoute />
      </RouteSuspense>
    ),
    children: [
      {
        path: "",
        element: (
          <RouteSuspense>
            <DashboardLayout />
          </RouteSuspense>
        ),
        children: [
          {
            index: true,
            element: (
              <RouteSuspense>
                <Dashboard />
              </RouteSuspense>
            ),
          },
          {
            path: "experiences",
            element: (
              <RouteSuspense>
                <ExperiencesPage />
              </RouteSuspense>
            ),
          },
          {
            path: "projects",
            element: (
              <RouteSuspense>
                <ProjectsAdminPage />
              </RouteSuspense>
            ),
          },
          {
            path: "messages",
            element: (
              <RouteSuspense>
                <MessagesPage />
              </RouteSuspense>
            ),
          },
          {
            path: "feedback",
            element: (
              <RouteSuspense>
                <FeedbackPage />
              </RouteSuspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <RouteSuspense>
        <NotFoundPage />
      </RouteSuspense>
    ),
  },
]);

export default router;
