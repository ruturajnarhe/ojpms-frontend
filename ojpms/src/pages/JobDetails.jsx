import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isApplied, setIsApplied] = useState(false);

  /* =========================================
       LOAD JOB DETAILS
    ========================================= */

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${id}`);

      setJob(response.data);

      checkApplication();
    } catch (error) {
      console.error(error);

      setError("Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
       CHECK EXISTING APPLICATION
    ========================================= */

  const checkApplication = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "JOB_SEEKER") {
      return;
    }

    try {
      const response = await api.get(`/applications/applicant/${user.id}`);

      const applications = response.data;

      const alreadyApplied = applications.some(
        (application) => application.job?.id === Number(id),
      );

      setIsApplied(alreadyApplied);
    } catch (error) {
      console.error("Unable to check application:", error);
    }
  };

  /* =========================================
       APPLY FOR JOB
    ========================================= */

  const handleApply = async () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "JOB_SEEKER") {
      setError("Only job seekers can apply for jobs.");

      return;
    }

    if (isApplied) {
      setMessage("You have already applied for this job.");

      return;
    }

    try {
      setApplying(true);

      setMessage("");
      setError("");

      const application = {
        job: {
          id: Number(id),
        },

        applicant: {
          id: user.id,
        },
      };

      await api.post("/applications", application);

      setIsApplied(true);

      setMessage("Job application submitted successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to apply for this job.",
      );
    } finally {
      setApplying(false);
    }
  };

  /* =========================================
       LOADING
    ========================================= */

  if (loading) {
    return (
      <div className="page-container">
        <div className="job-details-loading">
          <div className="loading-spinner">⏳</div>

          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  /* =========================================
       ERROR / JOB NOT FOUND
    ========================================= */

  if (error && !job) {
    return (
      <div className="page-container">
        <div className="job-details-error">
          <div className="job-error-icon">⚠️</div>

          <h2>Unable to Load Job</h2>

          <p>{error}</p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container">
        <div className="job-details-error">
          <div className="job-error-icon">🔍</div>

          <h2>Job Not Found</h2>

          <p>The job you are looking for does not exist or has been removed.</p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  /* =========================================
       JOB STATUS
    ========================================= */

  const isOpen = job.status?.toUpperCase() === "OPEN";

  return (
    <div className="page-container">
      {/* =========================================
                BACK BUTTON
            ========================================= */}

      <button className="job-details-back" onClick={() => navigate("/jobs")}>
        ← Back to Jobs
      </button>

      {/* =========================================
                JOB DETAILS CARD
            ========================================= */}

      <div className="job-details-page">
        {/* =====================================
                    HEADER
                ===================================== */}

        <div className="job-details-header">
          <div className="job-details-title-area">
            <h1>{job.title}</h1>

            <p className="job-details-company">
              {job.recruiter?.name || "Company / Recruiter"}
            </p>
          </div>

          <span
            className={`status ${isOpen ? "status-open" : "status-closed"}`}
          >
            {job.status || "UNKNOWN"}
          </span>
        </div>

        {/* =====================================
                    JOB INFORMATION
                ===================================== */}

        <div className="job-details-info">
          {/* LOCATION */}

          <div className="job-info-item">
            <span>📍</span>

            <div>
              <small>Location</small>

              <strong>{job.location || "Not specified"}</strong>
            </div>
          </div>

          {/* SALARY */}

          <div className="job-info-item">
            <span>💰</span>

            <div>
              <small>Salary</small>

              <strong>{job.salary || "Not specified"}</strong>
            </div>
          </div>

          {/* EXPERIENCE */}

          <div className="job-info-item">
            <span>💼</span>

            <div>
              <small>Experience</small>

              <strong>{job.experience || "Not specified"}</strong>
            </div>
          </div>

          {/* JOB TYPE */}

          <div className="job-info-item">
            <span>🏢</span>

            <div>
              <small>Job Type</small>

              <strong>{job.jobType || "Not specified"}</strong>
            </div>
          </div>

          {/* START DATE */}

          <div className="job-info-item">
            <span>📅</span>

            <div>
              <small>Start Date</small>

              <strong>{job.startDate || "Not specified"}</strong>
            </div>
          </div>

          {/* END DATE */}

          <div className="job-info-item">
            <span>⏳</span>

            <div>
              <small>Apply By</small>

              <strong>{job.endDate || "Not specified"}</strong>
            </div>
          </div>
        </div>

        {/* =====================================
                    DESCRIPTION
                ===================================== */}

        <div className="job-details-section">
          <h2>Job Description</h2>

          <p>{job.description || "No job description provided."}</p>
        </div>

        {/* =====================================
                    APPLY SECTION
                ===================================== */}

        <div className="job-apply-section">
          <div className="job-apply-content">
            <h2>
              {isApplied
                ? "Application Submitted"
                : isOpen
                  ? "Interested in this job?"
                  : "Applications Closed"}
            </h2>

            <p>
              {isApplied
                ? "You have already applied for this position."
                : isOpen
                  ? "Submit your application to apply for this position."
                  : "This job is no longer accepting applications."}
            </p>
          </div>

          {/* APPLY BUTTON */}

          {isApplied ? (
            <button className="btn btn-secondary" disabled>
              ✓ Already Applied
            </button>
          ) : !isOpen ? (
            <button className="btn btn-danger" disabled>
              Job Closed
            </button>
          ) : (
            <button
              className="btn btn-success job-apply-button"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          )}
        </div>

        {/* =====================================
                    SUCCESS MESSAGE
                ===================================== */}

        {message && (
          <div className="success-message job-feedback-message">{message}</div>
        )}

        {/* =====================================
                    ERROR MESSAGE
                ===================================== */}

        {error && (
          <div className="error-message job-feedback-message">{error}</div>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
