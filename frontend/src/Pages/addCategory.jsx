import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCategory = () => {
    const [formData, setFormData] = useState({
        name: "",
        label: "",
        description: ""
    });
    const token=localStorage.getItem("token");
    const [message, setMessage] = useState("");

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
                setMessage("Model added successfully!");
            }else{
                setMessage("Model failed to add!");
            }
            console.log(res.data);
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
        <div style={{ maxWidth: "500px", margin: "auto", marginTop: "50px" }}>
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

                <button type="submit" style={{ marginTop: "20px", padding: "10px 20px" }}>
                    Submit
                </button>
            </form>

            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
};

export default AddCategory;
