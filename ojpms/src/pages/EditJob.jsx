import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // =========================================
  // LOAD JOB
  // =========================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "RECRUITER") {
      navigate("/login");
      return;
    }

    if (!id) {
      setMessage("Invalid job ID");
      setLoading(false);
      return;
    }

    loadJob();
  }, [navigate, id]);

  // =========================================
  // GET JOB
  // =========================================

  const loadJob = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/jobs/${id}`);

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

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // UPDATE JOB
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await api.put(`/jobs/${id}`, job);

      console.log("Updated Job:", response.data);

      setMessage("Job updated successfully!");

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update job error:", error);

      console.error("Backend response:", error.response?.data);

      setMessage(error.response?.data?.message || "Unable to update job");
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="edit-job-page">
        <div className="edit-job-loading">
          <p>Loading job...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="edit-job-page">
      <div className="edit-job-card">
        {/* =====================================
            TOP HEADER
        ====================================== */}

        <div className="edit-job-top">
          <div className="edit-job-heading">
            <h1>Edit Job</h1>

            <p>Update the job information below.</p>
          </div>

          {/* GO TO DASHBOARD */}

          <button
            type="button"
            className="edit-job-dashboard"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            Go to Dashboard
          </button>
        </div>

        {/* =====================================
            MESSAGE
        ====================================== */}

        {message && (
          <div
            className={`edit-job-message ${
              message.toLowerCase().includes("success")
                ? "edit-job-success"
                : "edit-job-error"
            }`}
          >
            {message}
          </div>
        )}

        {/* =====================================
            FORM
        ====================================== */}

        <form className="edit-job-form" onSubmit={handleSubmit}>
          {/* JOB TITLE */}

          <div className="edit-job-field edit-job-full">
            <label htmlFor="title">Job Title</label>

            <input
              id="title"
              type="text"
              name="title"
              value={job.title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />
          </div>

          {/* LOCATION */}

          <div className="edit-job-field">
            <label htmlFor="location">Location</label>

            <input
              id="location"
              type="text"
              name="location"
              value={job.location}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          {/* SALARY */}

          <div className="edit-job-field">
            <label htmlFor="salary">Salary</label>

            <input
              id="salary"
              type="text"
              name="salary"
              value={job.salary}
              onChange={handleChange}
              placeholder="Example: 6 LPA"
            />
          </div>

          {/* EXPERIENCE */}

          <div className="edit-job-field">
            <label htmlFor="experience">Experience</label>

            <input
              id="experience"
              type="text"
              name="experience"
              value={job.experience}
              onChange={handleChange}
              placeholder="Example: 0-2 Years"
            />
          </div>

          {/* JOB TYPE */}

          <div className="edit-job-field">
            <label htmlFor="jobType">Job Type</label>

            <select
              id="jobType"
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

          {/* END DATE */}

          <div className="edit-job-field">
            <label htmlFor="endDate">End Date</label>

            <input
              id="endDate"
              type="date"
              name="endDate"
              value={job.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="edit-job-field edit-job-full">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              value={job.description}
              onChange={handleChange}
              placeholder="Enter job description"
              rows="5"
              required
            />
          </div>

          {/* =====================================
              BOTTOM BUTTONS
          ====================================== */}

          <div className="edit-job-actions">
            <button
              type="button"
              className="edit-job-cancel"
              onClick={() => navigate("/recruiter-dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="edit-job-update">
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJob;
