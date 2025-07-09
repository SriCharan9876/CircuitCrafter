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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload an image for profile picture before submitting.");
      return;
    }
    try {
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          ...formData,
          profilePic: { public_id, url },
        },
        {
          withCredentials: true,
        }
      );

      notify.success("Signup Successful!!");
      setMessage("Signup successful!");
      setFormData(initialFormData);
      setFile(null);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Signup failed. Please try again.";
      notify.error(errMsg);
      setMessage(errMsg);
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create an Account</h2>

        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

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

export default SignUp;
