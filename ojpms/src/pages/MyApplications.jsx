import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    // Only JOB_SEEKER can access this page
    if (user.role !== "JOB_SEEKER") {
      navigate("/recruiter-dashboard");
      return;
    }

    loadApplications(user.id);
  }, [navigate]);

  /* =========================================
       LOAD APPLICATIONS
    ========================================= */

  const loadApplications = async (applicantId) => {
    try {
      setLoading(true);

      setMessage("");

      const response = await api.get(`/applications/applicant/${applicantId}`);

      setApplications(response.data);
    } catch (error) {
      console.error(error);

      setMessage("Unable to load your applications.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
       STATUS CLASS
    ========================================= */

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "APPLIED":
        return "application-status status-applied";

      case "SHORTLISTED":
        return "application-status status-shortlisted";

      case "REJECTED":
        return "application-status status-rejected";

      case "SELECTED":
        return "application-status status-selected";

      default:
        return "application-status";
    }
  };

  /* =========================================
       VIEW JOB
    ========================================= */

  const handleViewJob = (jobId) => {
    if (!jobId) {
      return;
    }

    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="page-container">
      {/* =========================================
                PAGE HEADER
            ========================================= */}

      <div className="applications-page-header">
        <div>
          <h1 className="page-title">My Applications</h1>

          <p className="applications-subtitle">
            Track the jobs you have applied for and check your application
            status.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
          Browse Jobs
        </button>
      </div>

      {/* =========================================
                MESSAGE
            ========================================= */}

      {message && <div className="error-message">{message}</div>}

      {/* =========================================
                LOADING
            ========================================= */}

      {loading && (
        <div className="applications-empty-card">
          <div className="applications-loading">Loading applications...</div>
        </div>
      )}

      {/* =========================================
                EMPTY STATE
            ========================================= */}

      {!loading && applications.length === 0 && !message && (
        <div className="applications-empty-card">
          <div className="empty-applications-icon">📄</div>

          <h2>No Applications Yet</h2>

          <p>
            You haven't applied for any jobs yet. Start exploring available jobs
            and submit your first application.
          </p>

          <button className="btn btn-primary" onClick={() => navigate("/jobs")}>
            Find Jobs
          </button>
        </div>
      )}

      {/* =========================================
                APPLICATIONS
            ========================================= */}

      {!loading && applications.length > 0 && (
        <div className="applications-list">
          {applications.map((application) => {
            const job = application.job;

            const jobId = job?.id;

            const status = application.status || "APPLIED";

            return (
              <div className="application-card" key={application.id}>
                {/* =================================
                                    CARD HEADER
                                ================================= */}

                <div className="application-card-header">
                  <div>
                    <h2>{job?.title || "Job Title Not Available"}</h2>

                    <p className="application-company">
                      {job?.recruiter?.name || "Company / Recruiter"}
                    </p>
                  </div>

                  <span className={getStatusClass(status)}>{status}</span>
                </div>

                {/* =================================
                                    JOB INFORMATION
                                ================================= */}

                <div className="application-info-grid">
                  {/* LOCATION */}

                  <div className="application-info-item">
                    <span>📍</span>

                    <div>
                      <small>Location</small>

                      <strong>{job?.location || "Not specified"}</strong>
                    </div>
                  </div>

                  {/* SALARY */}

                  <div className="application-info-item">
                    <span>💰</span>

                    <div>
                      <small>Salary</small>

                      <strong>{job?.salary || "Not specified"}</strong>
                    </div>
                  </div>

                  {/* JOB TYPE */}

                  <div className="application-info-item">
                    <span>💼</span>

                    <div>
                      <small>Job Type</small>

                      <strong>{job?.jobType || "Not specified"}</strong>
                    </div>
                  </div>

                  {/* APPLIED DATE */}

                  <div className="application-info-item">
                    <span>📅</span>

                    <div>
                      <small>Applied Date</small>

                      <strong>
                        {application.appliedDate || "Not available"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* =================================
                                    CARD FOOTER
                                ================================= */}

                <div className="application-card-footer">
                  <div>
                    <span className="application-label">
                      Application Status
                    </span>

                    <span className={getStatusClass(status)}>{status}</span>
                  </div>

                  {jobId && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleViewJob(jobId)}
                    >
                      View Job
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
