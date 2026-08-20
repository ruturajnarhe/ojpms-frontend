import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  const goHome = () => {
    if (!user) {
      navigate("/login");

      return;
    }

    if (user.role === "RECRUITER") {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <header className="top-navbar">
      {/* =================================
                MOBILE MENU BUTTON
            ================================= */}

      {user && (
        <button className="menu-button" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* =================================
                LOGO
            ================================= */}

      <div className="top-navbar-logo" onClick={goHome}>
        OJPMS
      </div>

      {/* =================================
                RIGHT SIDE
            ================================= */}

      <div className="top-navbar-right">
        {user && (
          <div className="top-navbar-user">
            <div className="top-user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="top-user-info">
              <strong>{user.name}</strong>

              <span>
                {user.role === "RECRUITER" ? "Recruiter" : "Job Seeker"}
              </span>
            </div>
          </div>
        )}

        {user && (
          <button className="top-logout" onClick={logout}>
            Logout
          </button>
        )}
      </div>

      {/*

                The Sidebar is opened from the
                mobile menu button.

            */}

      {user && (
        <div
          className={`mobile-sidebar ${
            sidebarOpen ? "mobile-sidebar-open" : ""
          }`}
        >
          <div className="mobile-sidebar-header">
            <strong>OJPMS</strong>

            <button onClick={() => setSidebarOpen(false)}>×</button>
          </div>

          {user.role === "JOB_SEEKER" && (
            <>
              <button
                onClick={() => {
                  navigate("/jobs");
                  setSidebarOpen(false);
                }}
              >
                💼 Browse Jobs
              </button>

              <button
                onClick={() => {
                  navigate("/my-applications");
                  setSidebarOpen(false);
                }}
              >
                📋 My Applications
              </button>
            </>
          )}

          {user.role === "RECRUITER" && (
            <>
              <button
                onClick={() => {
                  navigate("/recruiter-dashboard");
                  setSidebarOpen(false);
                }}
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/create-job");
                  setSidebarOpen(false);
                }}
              >
                ➕ Create Job
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
