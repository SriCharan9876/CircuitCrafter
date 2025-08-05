import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager";
import GoogleLoginButton from "../features/googleLogin";
import { useNavigate } from "react-router-dom";
import "../Styles/signUp.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate=useNavigate();
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
            setMessage("Login successful!");
            notifySuccess();
            navigate("/models");
        } catch (error) {
            setMessage("Login failed. Please check your credentials.");
            notify.error("Login failed. Please check your credentials.")
            console.error(error);
        }
    };


    return (
      <div className="auth-wrapper">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-form-title">Login</h2>

          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email id"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            id="loginpass"
            required
          />
          <button type="submit" className="auth-submit-btn">Login</button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
            <p style={{ margin: '0 10px', textAlign: 'center',fontFamily:"'Poppins', sans-serif",fontSize:"large" }}>OR</p>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
          </div>
          <GoogleLoginButton/>

          <p className="auth-footer-link" style={{fontFamily:"'Poppins', sans-serif",fontSize:"1.2rem"}}>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>

          <div className="auth-guest-access">
            <p style={{ textAlign: "center", marginTop: "1rem",fontFamily:"'Poppins', sans-serif",fontSize:"1.2rem" }}>
              <button
                type="button"
                onClick={() => navigate("/models")}
                className="auth-guest-btn"
              >
                👀 Continue as Guest
              </button>
            </p>
          </div>

        </form>
      </div>
    );

};

export default Login;
