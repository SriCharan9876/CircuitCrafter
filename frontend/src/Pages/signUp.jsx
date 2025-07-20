import React, { useState } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import "../Styles/signUp.css";
import GoogleLoginButton from "../features/googleLogin";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ImageUploadBox from "../features/ImageUploadBox";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    role: "user",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return notify.error("Enter a valid email address.");
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`, {
        email: formData.email,
      });
      setOtpSent(true);
      notify.success("OTP sent to your email");
    } catch (error) {
      console.error(error);
      notify.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp: otp,
      });

      if (res.data.verified) {
        setOtpVerified(true);
        notify.success("OTP verified successfully");
      } else {
        notify.error("Invalid OTP");
      }
    } catch (error) {
      notify.error("OTP verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      notify.error("Please verify your email OTP first.");
      return;
    }

    try {
      let profilePic = null;
      if (file) {
        const imageForm = new FormData();
        imageForm.append("file", file);
        const imageUploadRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/files/profile`,
          imageForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const { public_id, url } = imageUploadRes.data;
        profilePic = { public_id, url };
      }

      const userPayLoad = profilePic ? { ...formData, profilePic } : formData;

      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        userPayLoad,
        {
          withCredentials: true,
        }
      );

      if (res.data.added) {
        setMessage("Signed up successfully");
        notify.success("Signup Successful!!");
      } else {
        setMessage("User signup failed!");
        notify.error("Signup failed!!");
      }

      setFormData(initialFormData);
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setFile(null);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Signup failed. Please try again.";
      notify.error(errMsg);
      setMessage(errMsg);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 className="auth-form-title">Create an Account</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Create username"
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <div className="signup-div">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email address"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleSendOtp} disabled={otpSent} className="optSec">
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>
        </div>

        {otpSent && (
          <div className="signup-div">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button" onClick={handleVerifyOtp} className="optSec">
              Verify OTP
            </button>
          </div>
        )}

        <label>Password</label>
        <div className="signup-div">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Setup password"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{border:"none",backgroundColor:"transparent",padding:"0",display: "flex",alignItems:"center",justifyContent:"center"}}>
            {showPassword ? <VisibilityOffIcon sx={{ fontSize: 24 }}/> : <VisibilityIcon sx={{ fontSize: 24 }}/>}
          </button>
        </div>

        <label style={{marginBottom:"1rem"}}>Profile picture</label>
        <div className="signup-div">
          <ImageUploadBox onImageSelect={(file)=>setFile(file)} boxSize={200} />
        </div>
        

        <button type="submit" className="auth-submit-btn">
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
          <p style={{ margin: "0 10px", textAlign: "center" }}>OR</p>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
        </div>

        {message && <p style={{ marginTop: "20px" }}>{message}</p>}

        <GoogleLoginButton />
        <p className="auth-footer-link">
          Already have an account? <a href="/login">Log In</a>
        </p>

        <div className="auth-guest-access">
            <p style={{ textAlign: "center", marginTop: "1rem" }}>
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
    </div>
  );
};

export default SignUp;
