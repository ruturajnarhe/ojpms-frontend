import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CreateJob from "./pages/CreateJob";
import MyApplications from "./pages/MyApplications";
import Applications from "./pages/Applications";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import EditJob from "./pages/EditJob";
import JobApplicants from "./pages/JobApplicants";
import RecruiterApplications from "./pages/RecruiterApplications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/create-job" element={<CreateJob />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/jobs" element={<JobSeekerDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/edit-job/:jobId" element={<EditJob />} />
        <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
        <Route
          path="/recruiter/applications/:jobId"
          element={<RecruiterApplications />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
