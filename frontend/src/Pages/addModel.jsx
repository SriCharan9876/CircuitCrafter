import React, { useState, useEffect } from "react";
import axios from "axios";

const AddModel = () => {
    const [formData, setFormData] = useState({
        modelName: "",
        typeId: "",
        typeName: "",
        description: "",
        fileUrl: "",
        createdBy: "", // should be filled using logged-in user id
    });

    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);

    // Load categories from backend to populate dropdown (optional)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/categories");
                setCategories(res.data); // assuming data is array of { _id, name }
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/addModel", formData, {
                withCredentials: true,
            });
            setMessage("Model added successfully!");
            console.log(res.data);
            setFormData({
                modelName: "",
                typeId: "",
                typeName: "",
                description: "",
                fileUrl: "",
                createdBy: "",
            });
        } catch (error) {
            setMessage("Failed to add model.");
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", marginTop: "50px" }}>
            <h2>Add New Model</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Model Name:</label><br />
                    <input
                        type="text"
                        name="modelName"
                        value={formData.modelName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Type (Category):</label><br />
                    <select
                        name="typeId"
                        value={formData.typeId}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">Select Type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Type Name:</label><br />
                    <input
                        type="text"
                        name="typeName"
                        value={formData.typeName}
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

                <div>
                    <label>File URL:</label><br />
                    <input
                        type="text"
                        name="fileUrl"
                        value={formData.fileUrl}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Created By (User ID):</label><br />
                    <input
                        type="text"
                        name="createdBy"
                        value={formData.createdBy}
                        onChange={handleChange}
                        required
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

export default AddModel;
