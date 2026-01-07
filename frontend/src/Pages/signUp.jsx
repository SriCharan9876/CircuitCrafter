import React, { useState } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import "../Styles/signUp.css";
import GoogleLoginButton from "../features/googleLogin";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ImageUploadBox from "../features/ImageUploadBox";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from "../contexts/authContext";
import circuitArt from "../assets/circuit_crafter_art.png";

const SignUp = () => {
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    role: "user",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


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
        notify.success("Signup Successful!!");
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true })
        if (res.data.token && res.data.user) {
          login(res.data.token, res.data.user); // from useAuth()
        }
        navigate("/models");
      } else {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left" style={{ backgroundImage: `url(${circuitArt})` }}>
          <div className="auth-left-content">
            <h1>Circuit Crafter</h1>
            <p>Join the community to design, simulate, and share your circuits.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-form-title">Sign Up</h2>
            <p className="auth-form-subtitle">Join us to explore and share circuit designs.</p>

            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="e.g. John Doe"
                  onChange={handleChange}
                  required
                />
                <PersonIcon className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  onChange={handleChange}
                  required
                />
                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 6V6.511L12 11.011L4 6.511V6H20ZM4 18V9.011L12 13.511L20 9.011V18H4Z"></path>
                </svg>
              </div>
              <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleSendOtp} disabled={otpSent} className="optSec">
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="input-group" style={{ animation: 'fadeIn 0.5s' }}>
                <label>Enter OTP</label>
                <div className="signup-div">
                  <input
                    type="text"
                    placeholder="XXXXXX"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ textAlign: 'center', letterSpacing: '4px' }}
                  />
                  <button type="button" onClick={handleVerifyOtp} className="optSec">
                    Verify
                  </button>
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                />
                <div
                  className="input-icon"
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Profile Picture</label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ImageUploadBox onImageSelect={(file) => setFile(file)} boxSize={150} />
              </div>
            </div>


            <button type="submit" className="auth-submit-btn">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="divider">
              <span>OR REGISTER WITH</span>
            </div>

            <GoogleLoginButton />

            <p className="auth-footer-link">
              Already have an account? <a href="/login">Log In</a>
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

export default SignUp;
