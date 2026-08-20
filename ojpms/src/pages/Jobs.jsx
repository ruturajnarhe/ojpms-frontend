import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  const [applyingJobId, setApplyingJobId] = useState(null);

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // =========================================
  // CHECK LOGIN + LOAD DATA
  // =========================================

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

    loadJobs();

    loadMyApplications(user.id);
  }, [navigate]);

  // =========================================
  // LOAD ALL JOBS
  // =========================================

  const loadJobs = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get("/jobs");

      setJobs(response.data);
    } catch (error) {
      console.error(error);

      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD MY APPLICATIONS
  // =========================================

  const loadMyApplications = async (applicantId) => {
    try {
      const response = await api.get(`/applications/applicant/${applicantId}`);

      const applications = response.data;

      const ids = applications
        .map((application) => application.job?.id)
        .filter((id) => id !== undefined);

      setAppliedJobIds(ids);
    } catch (error) {
      console.error("Unable to load applications:", error);
    }
  };

  // =========================================
  // SEARCH JOBS
  // =========================================

  const handleSearch = async () => {
    try {
      setLoading(true);

      setError("");

      setMessage("");

      let response;

      // Search by title

      if (title.trim() !== "") {
        response = await api.get("/jobs/search/title", {
          params: {
            title: title.trim(),
          },
        });
      }

      // Search by location
      else if (location.trim() !== "") {
        response = await api.get("/jobs/search/location", {
          params: {
            location: location.trim(),
          },
        });
      }

      // Search by job type
      else if (jobType.trim() !== "") {
        response = await api.get("/jobs/search/type", {
          params: {
            jobType: jobType,
          },
        });
      }

      // No search criteria
      else {
        response = await api.get("/jobs");
      }

      setJobs(response.data);
    } catch (error) {
      console.error(error);

      setError("Unable to search jobs.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // CLEAR SEARCH
  // =========================================

  const handleClearSearch = () => {
    setTitle("");

    setLocation("");

    setJobType("");

    setMessage("");

    setError("");

    loadJobs();
  };

  // =========================================
  // APPLY FOR JOB
  // =========================================

  const handleApply = async (jobId) => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");

      return;
    }

    const user = JSON.parse(storedUser);

    // Prevent duplicate application

    if (appliedJobIds.includes(jobId)) {
      setMessage("You have already applied for this job.");

      return;
    }

    try {
      setApplyingJobId(jobId);

      setMessage("");

      setError("");

      const application = {
        job: {
          id: jobId,
        },

        applicant: {
          id: user.id,
        },
      };

      await api.post("/applications", application);

      // Add job to applied list

      setAppliedJobIds((previous) => [...previous, jobId]);

      setMessage("Job application submitted successfully!");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Unable to apply for this job.",
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="page-container">
      {/* =========================================
                PAGE TITLE
            ========================================= */}

      <h1 className="page-title">Find Your Next Job</h1>

      {/* =========================================
                SEARCH SECTION
            ========================================= */}

      <div className="search-container">
        <h3>Search Jobs</h3>

        <div className="search-row">
          {/* TITLE */}

          <input
            className="search-input"
            type="text"
            placeholder="Search by job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* LOCATION */}

          <input
            className="search-input"
            type="text"
            placeholder="Search by location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* JOB TYPE */}

          <select
            className="search-input"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="">All Job Types</option>

            <option value="FULL_TIME">Full Time</option>

            <option value="PART_TIME">Part Time</option>

            <option value="INTERNSHIP">Internship</option>

            <option value="CONTRACT">Contract</option>
          </select>

          {/* SEARCH BUTTON */}

          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>

          {/* CLEAR BUTTON */}

          <button className="btn btn-secondary" onClick={handleClearSearch}>
            Clear
          </button>
        </div>
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
          <p>Loading jobs...</p>
        </div>
      )}

      {/* =========================================
                EMPTY STATE
            ========================================= */}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          <h3>No Jobs Found</h3>

          <p>Try changing your search criteria.</p>
        </div>
      )}

      {/* =========================================
                JOB CARDS
            ========================================= */}

      {!loading && jobs.length > 0 && (
        <div className="job-grid">
          {jobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);

            const isOpen = job.status?.toUpperCase() === "OPEN";

            return (
              <div className="job-card" key={job.id}>
                {/* JOB TITLE */}

                <h2>{job.title}</h2>

                {/* RECRUITER */}

                <div className="job-recruiter">
                  {job.recruiter?.name || "Company / Recruiter"}
                </div>

                {/* JOB DETAILS */}

                <div className="job-details">
                  {/* LOCATION */}

                  <div className="job-detail">
                    <strong>Location</strong>

                    {job.location || "Not specified"}
                  </div>

                  {/* SALARY */}

                  <div className="job-detail">
                    <strong>Salary</strong>

                    {job.salary || "Not specified"}
                  </div>

                  {/* EXPERIENCE */}

                  <div className="job-detail">
                    <strong>Experience</strong>

                    {job.experience || "Not specified"}
                  </div>

                  {/* JOB TYPE */}

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

                {/* JOB FOOTER */}

                <div className="job-footer">
                  {/* END DATE */}

                  <div className="job-end-date">
                    <strong>Apply by:</strong> {job.endDate || "Not specified"}
                  </div>

                  {/* STATUS */}

                  <span
                    className={`status ${
                      isOpen ? "status-open" : "status-closed"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* ACTION BUTTON */}

                <div className="job-actions">
                  {/* ALREADY APPLIED */}

                  {isApplied ? (
                    <button className="btn btn-secondary" disabled>
                      Already Applied
                    </button>
                  ) : /* JOB CLOSED */

                  !isOpen ? (
                    <button className="btn btn-danger" disabled>
                      Job Closed
                    </button>
                  ) : (
                    /* APPLY */

                    <button
                      className="btn btn-success"
                      onClick={() => handleApply(job.id)}
                      disabled={applyingJobId === job.id}
                    >
                      {applyingJobId === job.id ? "Applying..." : "Apply Now"}
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

export default Jobs;
