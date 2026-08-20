import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function RecruiterApplications() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // =========================================
  // CHECK RECRUITER LOGIN
  // =========================================

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

    loadApplications();
  }, [navigate, jobId]);

  // =========================================
  // LOAD APPLICATIONS
  // =========================================

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.get(`/applications/job/${jobId}`);

      setApplications(response.data);

      // Get job information from application

      if (response.data.length > 0) {
        setJob(response.data[0].job);
      } else {
        // If no applications exist,
        // get job separately

        const jobResponse = await api.get(`/jobs/${jobId}`);

        setJob(jobResponse.data);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to load job applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // UPDATE APPLICATION STATUS
  // =========================================

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      setMessage("");
      setError("");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        null,
        {
          params: {
            status: status,
          },
        },
      );

      // Update application in UI

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId ? response.data : application,
        ),
      );

      setMessage(`Application status updated to ${status}.`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to update application status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // STATUS CSS CLASS
  // =========================================

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "SELECTED":
        return "status status-open";

      case "REJECTED":
        return "status status-closed";

      case "SHORTLISTED":
        return "status status-applied";

      case "APPLIED":
      default:
        return "status status-applied";
    }
  };

  return (
    <div className="page-container">
      {/* =========================================
                BACK BUTTON
            ========================================= */}

      <button
        className="btn btn-secondary"
        onClick={() => navigate("/recruiter-dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* =========================================
                JOB INFORMATION
            ========================================= */}

      <div className="card">
        <h1 className="page-title">{job?.title || "Job Applications"}</h1>

        {job && (
          <>
            <p>
              <strong>Location:</strong> {job.location || "Not specified"}
            </p>

            <p>
              <strong>Job Type:</strong> {job.jobType || "Not specified"}
            </p>

            <p>
              <strong>Salary:</strong> {job.salary || "Not specified"}
            </p>

            <p>
              <strong>Experience:</strong> {job.experience || "Not specified"}
            </p>

            <p>
              <strong>Job Status:</strong> {job.status || "Not specified"}
            </p>

            <p>
              <strong>End Date:</strong> {job.endDate || "Not specified"}
            </p>
          </>
        )}
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
                LOADING
            ========================================= */}

      {loading && (
        <div className="card">
          <p>Loading applications...</p>
        </div>
      )}

      {/* =========================================
                NO APPLICATIONS
            ========================================= */}

      {!loading && applications.length === 0 && (
        <div className="empty-state">
          <h3>No Applications Yet</h3>

          <p>No job seeker has applied for this job yet.</p>
        </div>
      )}

      {/* =========================================
                APPLICATION LIST
            ========================================= */}

      {!loading && applications.length > 0 && (
        <>
          <h2 className="section-title">
            Applications ({applications.length})
          </h2>

          <div className="job-grid">
            {applications.map((application) => (
              <div className="job-card" key={application.id}>
                {/* =================================
                                            APPLICANT NAME
                                        ================================= */}

                <h2>{application.applicant?.name || "Unknown Applicant"}</h2>

                {/* =================================
                                            EMAIL
                                        ================================= */}

                <div className="job-recruiter">
                  {application.applicant?.email || "Email not available"}
                </div>

                {/* =================================
                                            APPLICATION DETAILS
                                        ================================= */}

                <div className="job-details">
                  {/* APPLICATION ID */}

                  <div className="job-detail">
                    <strong>Application ID</strong>#{application.id}
                  </div>

                  {/* APPLIED DATE */}

                  <div className="job-detail">
                    <strong>Applied Date</strong>

                    {application.appliedDate || "Not specified"}
                  </div>

                  {/* JOB */}

                  <div className="job-detail">
                    <strong>Job</strong>

                    {application.job?.title || job?.title || "Not specified"}
                  </div>

                  {/* STATUS */}

                  <div className="job-detail">
                    <strong>Status</strong>

                    <span className={getStatusClass(application.status)}>
                      {application.status || "APPLIED"}
                    </span>
                  </div>
                </div>

                {/* =================================
                                            ACTION BUTTONS
                                        ================================= */}

                <div
                  className="job-actions"
                  style={{
                    flexWrap: "wrap",
                  }}
                >
                  {/* SHORTLIST */}

                  <button
                    className="btn btn-secondary"
                    disabled={
                      updatingId === application.id ||
                      application.status?.toUpperCase() === "SHORTLISTED" ||
                      application.status?.toUpperCase() === "REJECTED" ||
                      application.status?.toUpperCase() === "SELECTED"
                    }
                    onClick={() => updateStatus(application.id, "SHORTLISTED")}
                  >
                    {updatingId === application.id
                      ? "Updating..."
                      : "Shortlist"}
                  </button>

                  {/* SELECT */}

                  <button
                    className="btn btn-success"
                    disabled={
                      updatingId === application.id ||
                      application.status?.toUpperCase() === "SELECTED" ||
                      application.status?.toUpperCase() === "REJECTED"
                    }
                    onClick={() => updateStatus(application.id, "SELECTED")}
                  >
                    {updatingId === application.id ? "Updating..." : "Select"}
                  </button>

                  {/* REJECT */}

                  <button
                    className="btn btn-danger"
                    disabled={
                      updatingId === application.id ||
                      application.status?.toUpperCase() === "REJECTED" ||
                      application.status?.toUpperCase() === "SELECTED"
                    }
                    onClick={() => updateStatus(application.id, "REJECTED")}
                  >
                    {updatingId === application.id ? "Updating..." : "Reject"}
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

export default RecruiterApplications;
