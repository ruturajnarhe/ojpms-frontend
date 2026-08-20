import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    // Only JOB_SEEKER can access this page
    if (user.role !== "JOB_SEEKER") {
      navigate("/login");
      return;
    }

    loadApplications(user.id);
  }, [navigate]);

  const loadApplications = async (applicantId) => {
    try {
      const response = await api.get(`/applications/applicant/${applicantId}`);

      setApplications(response.data);
    } catch (error) {
      console.error(error);

      setMessage("Unable to load applications");
    }
  };

  return (
    <div>
      <h1>My Applications</h1>

      <button onClick={() => navigate("/jobs")}>Browse Jobs</button>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>

      <hr />

      {message && <p>{message}</p>}

      {applications.length === 0 ? (
        <p>You have not applied for any jobs yet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h2>{application.job?.title}</h2>

            <p>
              <strong>Company/Recruiter:</strong>{" "}
              {application.job?.recruiter?.name}
            </p>

            <p>
              <strong>Location:</strong> {application.job?.location}
            </p>

            <p>
              <strong>Salary:</strong> {application.job?.salary}
            </p>

            <p>
              <strong>Applied Date:</strong> {application.appliedDate}
            </p>

            <p>
              <strong>Application Status:</strong> {application.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;
