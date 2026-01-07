import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";
import GoogleLoginButton from "../features/googleLogin";
import { useNavigate } from "react-router-dom";
import "../Styles/signUp.css";
import PersonIcon from '@mui/icons-material/Person';
import circuitArt from "../assets/circuit_crafter_art.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const notifySuccess = () => notify.success('login Successful');

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
      notifySuccess("Login successful");
      navigate("/models");
    } catch (error) {
      notify.error("Login failed. Please check your credentials.")
      console.error(error);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left" style={{ backgroundImage: `url(${circuitArt})` }}>
          <div className="auth-left-content">
            <h1>Circuit Crafter</h1>
            <p>Design, Simulate, and Share electronics circuits with the world.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">Enter your details to access your workspace.</p>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PersonIcon className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  id="loginpass"
                  required
                />
                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM12 4C13.657 4 15 5.343 15 7V10H9V7C9 5.343 10.343 4 12 4ZM6 20V12H18L18.001 20H6Z"></path>
                </svg>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">Sign In</button>

            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <GoogleLoginButton />

            <p className="auth-footer-link">
              Don't have an account? <a href="/signup">Create account</a>
            </p>

            <div className="auth-guest-access">
              <button
                type="button"
                onClick={() => navigate("/models")}
                className="auth-guest-btn"
              >
                <PersonIcon fontSize="small" /> Continue as Guest
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );

};

export default Login;
