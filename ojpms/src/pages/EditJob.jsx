import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD JOB
  // ==========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    // Only RECRUITER can edit jobs
    if (user.role !== "RECRUITER") {
      navigate("/login");
      return;
    }

    loadJob();
  }, [navigate, jobId]);

  // ==========================================
  // GET JOB BY ID
  // ==========================================

  const loadJob = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/jobs/${jobId}`);

      const existingJob = response.data;

      console.log("Existing Job:", existingJob);

      setJob({
        title: existingJob.title || "",
        description: existingJob.description || "",
        location: existingJob.location || "",
        salary: existingJob.salary || "",
        experience: existingJob.experience || "",
        jobType: existingJob.jobType || "",
        endDate: existingJob.endDate || "",
      });
    } catch (error) {
      console.error("Error loading job:", error);

      setMessage(error.response?.data?.message || "Unable to load job");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await api.put(`/jobs/${jobId}`, job);

      console.log("Updated Job:", response.data);

      setMessage("Job updated successfully!");

      // Return to recruiter dashboard
      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update job error:", error);

      console.error("Backend response:", error.response?.data);

      setMessage(error.response?.data?.message || "Unable to update job");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div>
        <h2>Loading job...</h2>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>
      <h1>Edit Job</h1>

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* =================================
                    JOB TITLE
                ================================= */}

        <div>
          <label>Job Title</label>

          <br />

          <input
            type="text"
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </div>

        <br />

        {/* =================================
                    DESCRIPTION
                ================================= */}

        <div>
          <label>Description</label>

          <br />

          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            placeholder="Enter job description"
            rows="5"
            required
          />
        </div>

        <br />

        {/* =================================
                    LOCATION
                ================================= */}

        <div>
          <label>Location</label>

          <br />

          <input
            type="text"
            name="location"
            value={job.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>

        <br />

        {/* =================================
                    SALARY
                ================================= */}

        <div>
          <label>Salary</label>

          <br />

          <input
            type="text"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            placeholder="Example: 6 LPA"
          />
        </div>

        <br />

        {/* =================================
                    EXPERIENCE
                ================================= */}

        <div>
          <label>Experience</label>

          <br />

          <input
            type="text"
            name="experience"
            value={job.experience}
            onChange={handleChange}
            placeholder="Example: 0-2 Years"
          />
        </div>

        <br />

        {/* =================================
                    JOB TYPE
                ================================= */}

        <div>
          <label>Job Type</label>

          <br />

          <select
            name="jobType"
            value={job.jobType}
            onChange={handleChange}
            required
          >
            <option value="">Select Job Type</option>

            <option value="FULL_TIME">Full Time</option>

            <option value="PART_TIME">Part Time</option>

            <option value="INTERNSHIP">Internship</option>

            <option value="CONTRACT">Contract</option>
          </select>
        </div>

        <br />

        {/* =================================
                    END DATE
                ================================= */}

        <div>
          <label>End Date</label>

          <br />

          <input
            type="date"
            name="endDate"
            value={job.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        {/* =================================
                    BUTTONS
                ================================= */}

        <button type="submit">Update Job</button>

        <button type="button" onClick={() => navigate("/recruiter-dashboard")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditJob;
