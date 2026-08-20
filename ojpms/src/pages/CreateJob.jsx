import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

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

  // Handle input changes
  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // Create job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      // Check recruiter role
      if (user.role !== "RECRUITER") {
        navigate("/login");
        return;
      }

      const jobData = {
        title: job.title,

        description: job.description,

        location: job.location,

        salary: job.salary,

        experience: job.experience,

        jobType: job.jobType,

        endDate: job.endDate,

        recruiter: {
          id: user.id,
        },
      };

      const response = await api.post("/jobs", jobData);

      console.log("Created Job:", response.data);

      setMessage("Job created successfully!");

      // Redirect to recruiter dashboard
      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Create job error:", error);

      setMessage(error.response?.data?.message || "Unable to create job");
    }
  };

  return (
    <div>
      <h1>Create Job</h1>

      <form onSubmit={handleSubmit}>
        {/* TITLE */}

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

        {/* DESCRIPTION */}

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

        {/* LOCATION */}

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

        {/* SALARY */}

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

        {/* EXPERIENCE */}

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

        {/* JOB TYPE */}

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

        {/* END DATE */}

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

        {/* BUTTONS */}

        <button type="submit">Create Job</button>

        <button type="button" onClick={() => navigate("/recruiter-dashboard")}>
          Cancel
        </button>
      </form>

      {/* MESSAGE */}

      {message && (
        <p>
          <strong>{message}</strong>
        </p>
      )}
    </div>
  );
}

export default CreateJob;
