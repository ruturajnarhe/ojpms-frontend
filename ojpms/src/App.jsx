import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import RecruiterApplications from "./pages/RecruiterApplications";

import "./App.css";

/* =========================================
   MAIN LAYOUT
========================================= */

function AppLayout() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  /* =========================================
     AUTH PAGES

     Hide Navbar + Sidebar
     on Login/Register
  ========================================= */

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* =====================================
          LOGIN / REGISTER
      ===================================== */}

      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        /* =====================================
           APPLICATION LAYOUT
        ===================================== */

        <div className="app-layout">
          {/* =====================================
              TOP NAVBAR
          ===================================== */}

          <Navbar />

          {/* =====================================
              SIDEBAR
          ===================================== */}

          {user && (
            <Sidebar
              isOpen={sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)}
            />
          )}

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

          <main className={user ? "main-content" : "main-content-full"}>
            <Routes>
              {/* =================================
                  DEFAULT ROUTE
              ================================= */}

              <Route
                path="/"
                element={
                  user ? (
                    user.role === "RECRUITER" ? (
                      <Navigate to="/recruiter-dashboard" replace />
                    ) : (
                      <Navigate to="/jobs" replace />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* =================================
                  JOB SEEKER ROUTES
              ================================= */}

              <Route path="/jobs" element={<Jobs />} />

              {/* =================================
                  JOB DETAILS

                  IMPORTANT:
                  Jobs.jsx uses /job/:id
              ================================= */}

              <Route path="/job/:id" element={<JobDetails />} />

              {/* =================================
                  MY APPLICATIONS
              ================================= */}

              <Route path="/my-applications" element={<MyApplications />} />

              {/* =================================
                  RECRUITER ROUTES
              ================================= */}

              <Route
                path="/recruiter-dashboard"
                element={<RecruiterDashboard />}
              />

              {/* =================================
                  CREATE JOB
              ================================= */}

              <Route path="/create-job" element={<CreateJob />} />

              {/* =================================
                  EDIT JOB
              ================================= */}

              <Route path="/edit-job/:id" element={<EditJob />} />

              {/* =================================
                  RECRUITER APPLICATIONS
              ================================= */}

              <Route
                path="/recruiter/applications/:jobId"
                element={<RecruiterApplications />}
              />

              {/* =================================
                  FALLBACK
              ================================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      user?.role === "RECRUITER"
                        ? "/recruiter-dashboard"
                        : "/jobs"
                    }
                    replace
                  />
                }
              />
            </Routes>
          </main>
        </div>
      )}
    </>
  );
}

/* =========================================
   APP
========================================= */

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
