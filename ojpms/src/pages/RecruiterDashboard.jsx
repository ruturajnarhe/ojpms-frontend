import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD RECRUITER
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // User not logged in
    if (!storedUser) {
      navigate("/login");

      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    // Only RECRUITER can access dashboard
    if (loggedInUser.role !== "RECRUITER") {
      navigate("/login");

      return;
    }

    setUser(loggedInUser);

    loadJobs(loggedInUser.id);
  }, [navigate]);

  // ==========================================
  // GET RECRUITER JOBS
  // ==========================================

  const loadJobs = async (recruiterId) => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/jobs/recruiter/${recruiterId}`);

      console.log("Recruiter Jobs:", response.data);

      setJobs(response.data);
    } catch (error) {
      console.error("Error loading recruiter jobs:", error);

      setMessage(error.response?.data?.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);

      setMessage("Job deleted successfully");

      // Refresh jobs
      loadJobs(user.id);
    } catch (error) {
      console.error("Delete job error:", error);

      setMessage(error.response?.data?.message || "Unable to delete job");
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
  // WAIT FOR USER
  // ==========================================

  if (!user) {
    return <h2>Loading...</h2>;
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      <p>
        Welcome, <strong>{user.name}</strong>
      </p>

      <p>Email: {user.email}</p>

      {/* ===============================
                ACTION BUTTONS
            =============================== */}

      <button onClick={() => navigate("/create-job")}>Create Job</button>

      <button onClick={logout}>Logout</button>

      <hr />

      <h2>My Jobs</h2>

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      {/* LOADING */}

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>You have not created any jobs yet.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              maxWidth: "650px",
            }}
          >
            <h2>{job.title}</h2>

            <p>
              <strong>Description:</strong> {job.description}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p>
              <strong>Salary:</strong> {job.salary}
            </p>

            <p>
              <strong>Experience:</strong> {job.experience}
            </p>

            <p>
              <strong>Job Type:</strong> {job.jobType}
            </p>

            <p>
              <strong>Start Date:</strong> {job.startDate}
            </p>

            <p>
              <strong>End Date:</strong> {job.endDate}
            </p>

            <p>
              <strong>Status:</strong> {job.status}
            </p>

            <br />

            {/* EDIT */}

            <button onClick={() => navigate(`/edit-job/${job.id}`)}>
              Edit
            </button>

            {/* DELETE */}

            <button onClick={() => deleteJob(job.id)}>Delete</button>

            {/* VIEW APPLICANTS */}

            <button onClick={() => navigate(`/job-applicants/${job.id}`)}>
              View Applicants
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default RecruiterDashboard;
