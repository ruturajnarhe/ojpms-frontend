import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    endDate: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE JOB
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      setLoading(true);

      const jobData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        salary: formData.salary.trim(),
        experience: formData.experience.trim(),
        jobType: formData.jobType,
        endDate: formData.endDate,
        description: formData.description.trim(),

        // New jobs are created as OPEN
        status: "OPEN",

        // Recruiter
        recruiter: {
          id: user.id,
        },
      };

      await api.post("/jobs", jobData);

      setMessage("Job created successfully!");

      setFormData({
        title: "",
        location: "",
        salary: "",
        experience: "",
        jobType: "",
        endDate: "",
        description: "",
      });

      // Optional short delay so success message can be seen
      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Create job error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create job. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {
    navigate("/recruiter-dashboard");
  };

  return (
    <div className="create-job-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="create-job-header">
        <div className="create-job-header-content">
          <h1>Create Job</h1>

          <p>Post a new job opportunity and find the right candidate.</p>
        </div>

        <button
          type="button"
          className="create-job-back-btn"
          onClick={() => navigate("/recruiter-dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* =====================================================
          SUCCESS / ERROR MESSAGE
          ===================================================== */}

      {message && <div className="create-job-success">{message}</div>}

      {error && <div className="create-job-error">{error}</div>}

      {/* =====================================================
          FORM CARD
          ===================================================== */}

      <div className="create-job-form-card">
        <form className="create-job-form" onSubmit={handleSubmit}>
          {/* =================================================
              JOB INFORMATION
              ================================================= */}

          <div className="create-job-section">
            <div className="create-job-section-header">
              <div className="create-job-section-icon">💼</div>

              <div>
                <h2>Job Information</h2>

                <p>Enter the basic information about the position.</p>
              </div>
            </div>

            <div className="create-job-divider"></div>

            <div className="create-job-grid">
              {/* TITLE */}

              <div className="create-job-field">
                <label htmlFor="title">
                  Job Title <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Java Developer"
                  required
                />
              </div>

              {/* LOCATION */}

              <div className="create-job-field">
                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune, Maharashtra"
                  required
                />
              </div>

              {/* SALARY */}

              <div className="create-job-field">
                <label htmlFor="salary">
                  Salary <span>*</span>
                </label>

                <input
                  id="salary"
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹4 - ₹6 LPA"
                  required
                />
              </div>

              {/* EXPERIENCE */}

              <div className="create-job-field">
                <label htmlFor="experience">
                  Experience <span>*</span>
                </label>

                <input
                  id="experience"
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 0 - 2 Years"
                  required
                />
              </div>

              {/* JOB TYPE */}

              <div className="create-job-field">
                <label htmlFor="jobType">
                  Job Type <span>*</span>
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
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

              <div className="create-job-field">
                <label htmlFor="endDate">
                  Application End Date <span>*</span>
                </label>

                <input
                  id="endDate"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* =================================================
              DESCRIPTION
              ================================================= */}

          <div className="create-job-section create-job-description-section">
            <div className="create-job-section-header">
              <div className="create-job-section-icon">📝</div>

              <div>
                <h2>Job Description</h2>

                <p>Provide details about the role and responsibilities.</p>
              </div>
            </div>

            <div className="create-job-divider"></div>

            <div className="create-job-field">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter job responsibilities, required skills, qualifications, etc."
                required
              />
            </div>
          </div>

          {/* =================================================
              ACTIONS
              ================================================= */}

          <div className="create-job-actions">
            <button
              type="button"
              className="create-job-cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-job-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
