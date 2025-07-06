import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                email,
                password
            }, { withCredentials: true });

            if (response.data.token && response.data.user) {
                login(response.data.token, response.data.user); // from useAuth()
            }
            setMessage("Login successful!");
        } catch (error) {
            setMessage("Login failed. Please check your credentials.");
            console.error(error);
        }
    };


    return (
        <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Login
                </button>
            </form>
            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
};

export default Login;
