import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user", // Default role
    });

    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please upload an image for profile picture before submitting.");
            return;
        }
        const imageForm=new FormData();
        imageForm.append("file",file);
        const imageUploadres = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/profile`,imageForm,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        const { public_id, url } = imageUploadres.data;
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
                ...formData,
                profilePic: { public_id, url }
            },{
                withCredentials:true
            });
            setMessage("Signup successful!");

            //redirect or reset form
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "user",
            });
            setFile(null);

        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || "Signup failed. Please try again.";
            setMessage(errMsg);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Name:</label><br />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Role:</label><br />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <label>Upload your profile picture</label>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    {/* {uploadedUrl && <a href={uploadedUrl} target="_blank" rel="noreferrer">View Uploaded File</a>} */}
                </div>
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Sign Up
                </button>
            </form>
            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
};

export default SignUp;
