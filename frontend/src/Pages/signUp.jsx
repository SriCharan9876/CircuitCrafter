import React, { useState } from "react";
import axios from "axios";
import { notify } from "../features/toastManager";
import "../Styles/signUp.css";
import GoogleLoginButton from "../features/googleLogin";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Only image files are allowed for profile picture.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleSendOtp = async () => {
    try {
      console.log(formData.email);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-otp`, {
        email: formData.email,
      });
      setOtpSent(true);
      notify.success("OTP sent to your email");
    } catch (error) {
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
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create an Account</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <div style={{ display: "flex", gap: "8px" ,alignItems:"center",justifyContent:"center"}}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleSendOtp} disabled={otpSent} className="optSec">
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>
        </div>

        {otpSent && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
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
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <label>Upload your profile picture</label>
        <input type="file" onChange={handleFileChange} />

        {file && (
          <div className="image-preview">
            <img src={URL.createObjectURL(file)} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn">
          Sign Up
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
          <p style={{ margin: "0 10px", textAlign: "center" }}>OR</p>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ccc" }}></div>
        </div>

        {message && <p style={{ marginTop: "20px" }}>{message}</p>}

        <GoogleLoginButton />
      </form>
    </div>
  );
};

export default SignUp;
