import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({});

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================
       CHECK LOGIN + LOAD JOBS
    ========================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "RECRUITER") {
      navigate("/jobs");
      return;
    }

    loadJobs(user.id);
  }, [navigate]);

  /* =========================================
       LOAD RECRUITER JOBS
    ========================================= */

  const loadJobs = async (recruiterId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      const recruiterJobs = response.data.filter(
        (job) => job.recruiter?.id === recruiterId,
      );

      setJobs(recruiterJobs);

      loadApplicationCounts(recruiterJobs);
    } catch (error) {
      console.error(error);

      setError("Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
       LOAD APPLICATION COUNTS
    ========================================= */

  const loadApplicationCounts = async (recruiterJobs) => {
    try {
      const counts = {};

      await Promise.all(
        recruiterJobs.map(async (job) => {
          try {
            const response = await api.get(`/applications/job/${job.id}`);

            counts[job.id] = response.data.length;
          } catch (error) {
            console.error(
              `Unable to load applications for job ${job.id}`,
              error,
            );

            counts[job.id] = 0;
          }
        }),
      );

      setApplicationCounts(counts);
    } catch (error) {
      console.error("Unable to load application counts:", error);
    }
  };

  /* =========================================
       DELETE JOB
    ========================================= */

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await api.delete(`/jobs/${jobId}`);

      setJobs((previousJobs) => previousJobs.filter((job) => job.id !== jobId));

      setApplicationCounts((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[jobId];

        return updated;
      });

      setMessage("Job deleted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 500) {
        setError(
          "This job cannot be deleted because applicants have already applied. Please manage the applications instead.",
        );
      } else {
        setError(error.response?.data?.message || "Unable to delete job.");
      }
    }
  };

  /* =========================================
       STATUS CLASS
    ========================================= */

  const getStatusClass = (status) => {
    if (status?.toUpperCase() === "OPEN") {
      return "status status-open";
    }

    return "status status-closed";
  };

  /* =========================================
       DASHBOARD STATISTICS
    ========================================= */

  const totalJobs = jobs.length;

  const openJobs = jobs.filter(
    (job) => job.status?.toUpperCase() === "OPEN",
  ).length;

  const closedJobs = totalJobs - openJobs;

  const totalApplications = Object.values(applicationCounts).reduce(
    (total, count) => total + (count || 0),
    0,
  );

  return (
    <div className="page-container">
      {/* =========================================
                DASHBOARD HEADER
            ========================================= */}

      <div className="recruiter-dashboard-header">
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>

          <p className="dashboard-subtitle">
            Manage your job postings and applications.
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={() => navigate("/create-job")}
        >
          + Create Job
        </button>
      </div>

      {/* =========================================
                SUCCESS MESSAGE
            ========================================= */}

      {message && <div className="success-message">{message}</div>}

      {/* =========================================
                ERROR MESSAGE
            ========================================= */}

      {error && <div className="error-message">{error}</div>}

      {/* =========================================
                DASHBOARD STATISTICS
            ========================================= */}

      {!loading && (
        <div className="dashboard-stats">
          {/* TOTAL JOBS */}

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">💼</div>

            <div>
              <span>Total Jobs</span>

              <strong>{totalJobs}</strong>
            </div>
          </div>

          {/* OPEN JOBS */}

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">🟢</div>

            <div>
              <span>Open Jobs</span>

              <strong>{openJobs}</strong>
            </div>
          </div>

          {/* CLOSED JOBS */}

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">🔴</div>

            <div>
              <span>Closed Jobs</span>

              <strong>{closedJobs}</strong>
            </div>
          </div>

          {/* TOTAL APPLICATIONS */}

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">📋</div>

            <div>
              <span>Applications</span>

              <strong>{totalApplications}</strong>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
                LOADING
            ========================================= */}

      {loading && (
        <div className="card">
          <p>Loading your jobs...</p>
        </div>
      )}

      {/* =========================================
                NO JOBS
            ========================================= */}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          <div className="empty-dashboard-icon">💼</div>

          <h3>No Jobs Posted Yet</h3>

          <p>You haven't created any job postings yet.</p>

          <button
            className="btn btn-success"
            onClick={() => navigate("/create-job")}
          >
            Create Your First Job
          </button>
        </div>
      )}

      {/* =========================================
                JOB LIST
            ========================================= */}

      {!loading && jobs.length > 0 && (
        <>
          <div className="dashboard-section-header">
            <div>
              <h2 className="section-title">My Job Postings</h2>

              <p>Manage your posted jobs and applications.</p>
            </div>

            <span className="job-count-badge">{jobs.length} Jobs</span>
          </div>

          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                {/* JOB TITLE */}

                <div className="recruiter-job-card-header">
                  <h2>{job.title}</h2>

                  <span className={getStatusClass(job.status)}>
                    {job.status || "UNKNOWN"}
                  </span>
                </div>

                {/* JOB DETAILS */}

                <div className="job-details">
                  <div className="job-detail">
                    <strong>Location</strong>

                    {job.location || "Not specified"}
                  </div>

                  <div className="job-detail">
                    <strong>Salary</strong>

                    {job.salary || "Not specified"}
                  </div>

                  <div className="job-detail">
                    <strong>Experience</strong>

                    {job.experience || "Not specified"}
                  </div>

                  <div className="job-detail">
                    <strong>Job Type</strong>

                    {job.jobType || "Not specified"}
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="job-description-title">Description</div>

                <p className="job-description">
                  {job.description || "No description available."}
                </p>

                {/* APPLICATION COUNT */}

                <div className="recruiter-application-count">
                  <span>📋</span>

                  <strong>Applications</strong>

                  <span className="application-count-number">
                    {applicationCounts[job.id] ?? "Loading..."}
                  </span>
                </div>

                {/* JOB FOOTER */}

                <div className="job-footer">
                  <div className="job-end-date">
                    <strong>End Date:</strong> {job.endDate || "Not specified"}
                  </div>
                </div>

                {/* ACTION BUTTONS */}

                <div className="job-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/recruiter/applications/${job.id}`)
                    }
                  >
                    View Applications
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/edit-job/${job.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default RecruiterDashboard;
