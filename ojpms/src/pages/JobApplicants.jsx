import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function JobApplicants() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // CHECK RECRUITER
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    if (loggedInUser.role !== "RECRUITER") {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    loadJob();
    loadApplications();
  }, [navigate, jobId]);

  // ==========================================
  // LOAD JOB
  // ==========================================

  const loadJob = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);

      setJob(response.data);
    } catch (error) {
      console.error("Error loading job:", error);

      setMessage(error.response?.data?.message || "Unable to load job");
    }
  };

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/applications/job/${jobId}`);

      console.log("Applications:", response.data);

      setApplications(response.data);
    } catch (error) {
      console.error("Error loading applications:", error);

      setMessage(
        error.response?.data?.message || "Unable to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await api.put(
        `/applications/${applicationId}/status`,
        null,
        {
          params: {
            status: status,
          },
        },
      );

      console.log("Updated Application:", response.data);

      // Update application in React state
      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: status,
              }
            : application,
        ),
      );

      setMessage(`Application ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error("Update status error:", error);

      setMessage(
        error.response?.data?.message || "Unable to update application status",
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!user) {
    return <h2>Loading...</h2>;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      <h1>Job Applicants</h1>

      {/* JOB INFORMATION */}

      {job && (
        <div>
          <h2>{job.title}</h2>

          <p>
            <strong>Location:</strong> {job.location}
          </p>

          <p>
            <strong>Salary:</strong> {job.salary}
          </p>

          <p>
            <strong>Status:</strong> {job.status}
          </p>
        </div>
      )}

      <hr />

      {/* BUTTONS */}

      <button onClick={() => navigate("/recruiter-dashboard")}>
        Back to Dashboard
      </button>

      <button onClick={logout}>Logout</button>

      <hr />

      <h2>Applicants</h2>

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* LOADING */}

      {loading ? (
        <p>Loading applicants...</p>
      ) : applications.length === 0 ? (
        <p>No applicants have applied for this job yet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              maxWidth: "650px",
            }}
          >
            <h3>Applicant Details</h3>

            <p>
              <strong>Name:</strong> {application.applicant?.name}
            </p>

            <p>
              <strong>Email:</strong> {application.applicant?.email}
            </p>

            <p>
              <strong>Applied Date:</strong> {application.appliedDate}
            </p>

            <p>
              <strong>Current Status:</strong> {application.status}
            </p>

            <br />

            {/* SHORTLIST */}

            <button onClick={() => updateStatus(application.id, "SHORTLISTED")}>
              Shortlist
            </button>

            {/* SELECT */}

            <button onClick={() => updateStatus(application.id, "SELECTED")}>
              Select
            </button>

            {/* REJECT */}

            <button onClick={() => updateStatus(application.id, "REJECTED")}>
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default JobApplicants;
