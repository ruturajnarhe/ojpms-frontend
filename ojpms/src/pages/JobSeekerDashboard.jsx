import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function JobSeekerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    // Only JOB_SEEKER can access this page
    if (loggedInUser.role !== "JOB_SEEKER") {
      navigate("/login");
      return;
    }

    setUser(loggedInUser);

    loadJobs();
  }, [navigate]);

  // Get all jobs
  const loadJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/jobs");

      console.log("Jobs:", response.data);

      setJobs(response.data);
    } catch (error) {
      console.error("Error loading jobs:", error);

      setMessage(error.response?.data?.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Apply for job
  const applyForJob = async (jobId) => {
    try {
      const application = {
        job: {
          id: jobId,
        },
        applicant: {
          id: user.id,
        },
      };

      const response = await api.post("/applications", application);

      console.log("Application:", response.data);

      setMessage("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);

      setMessage(
        error.response?.data?.message || "Unable to apply for this job",
      );
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Job Seeker Dashboard</h1>

      <h3>Welcome, {user.name}</h3>

      <p>Email: {user.email}</p>

      <div>
        <button onClick={() => navigate("/my-applications")}>
          My Applications
        </button>

        <button onClick={logout}>Logout</button>
      </div>

      <hr />

      <h2>Available Jobs</h2>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "20px",
              maxWidth: "600px",
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

            {job.status === "OPEN" ? (
              <button onClick={() => applyForJob(job.id)}>Apply Now</button>
            ) : (
              <button disabled>Job Closed</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default JobSeekerDashboard;
