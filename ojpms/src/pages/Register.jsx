import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "JOB_SEEKER"
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/users", user);

            console.log(response.data);

            setMessage("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Role</label>

                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                    >
                        <option value="JOB_SEEKER">
                            Job Seeker
                        </option>

                        <option value="RECRUITER">
                            Recruiter
                        </option>
                    </select>

                </div>

                <button type="submit">
                    Register
                </button>

            </form>

            {message && <p>{message}</p>}

        </div>
    );
}

export default Register;