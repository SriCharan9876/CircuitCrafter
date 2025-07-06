import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const AddCategory = () => {
    const navigate=useNavigate();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        label: "",
        description: ""
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!user || user.role !== "admin") {
            alert("Login as admin");
            navigate("/login");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, formData, {
                withCredentials: true,
                headers:{Authorization:`Bearer ${token}`}
            });
            if(res.data.added){
                setMessage("Category added successfully!");
            }else{
                setMessage("Category failed to add!");
            }
            setFormData({
                name: "",
                label: "",
                description: ""
            });
        } catch (error) {
            setMessage("Failed to add category.");
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", marginTop: "50px" }} className="allPages">
            <h2>Add New Category</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Category Name:</label><br />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Category Label:</label><br />
                    <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Description:</label><br />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ marginTop: "20px", padding: "10px 20px" }} disabled={!formData.name || !formData.label}>
                    Submit
                </button>
            </form>

            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
};

export default AddCategory;
