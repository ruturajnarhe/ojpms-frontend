import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

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
    <nav className="navbar">
      {/* LOGO */}

      <div className="navbar-logo" onClick={goHome}>
        OJPMS
      </div>

      {/* NAVIGATION */}

      <div className="navbar-links">
        {/* JOB SEEKER */}

        {user && user.role === "JOB_SEEKER" && (
          <>
            <button className="navbar-button" onClick={() => navigate("/jobs")}>
              Jobs
            </button>

            <button
              className="navbar-button"
              onClick={() => navigate("/my-applications")}
            >
              My Applications
            </button>
          </>
        )}

        {/* RECRUITER */}

        {user && user.role === "RECRUITER" && (
          <button
            className="navbar-button"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            Dashboard
          </button>
        )}

        {/* USER NAME */}

        {user && <span className="navbar-welcome">Welcome, {user.name}</span>}

        {/* LOGOUT */}

        {user && (
          <button className="navbar-button logout-button" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
