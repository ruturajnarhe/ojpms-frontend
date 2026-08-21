import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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

function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <div className="app-layout">
          <Navbar />

          {user && (
            <Sidebar
              isOpen={sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)}
            />
          )}

          <main className={user ? "main-content" : "main-content-full"}>
            <Routes>
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

              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/my-applications" element={<MyApplications />} />
              <Route
                path="/recruiter-dashboard"
                element={<RecruiterDashboard />}
              />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/edit-job/:id" element={<EditJob />} />
              <Route
                path="/recruiter/applications/:jobId"
                element={<RecruiterApplications />}
              />

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

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
