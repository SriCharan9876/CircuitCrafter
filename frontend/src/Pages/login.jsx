import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager";
import GoogleLoginButton from "../features/googleLogin";
import "../Styles/login.css"
import { useNavigate } from "react-router-dom";

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
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Login</h2>

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="loginpass"
            required
          />
          <button type="submit" className="submit-btn">Login</button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
            <p style={{ margin: '0 10px', textAlign: 'center' }}>OR</p>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
          </div>
          <GoogleLoginButton/>
        </form>
      </div>
    );

};

export default Login;
