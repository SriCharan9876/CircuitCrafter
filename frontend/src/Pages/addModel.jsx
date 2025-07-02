import React, { useState, useEffect } from "react";
import axios from "axios";

const AddModel = () => {
    const [formData, setFormData] = useState({
        modelName: "",
        typeName: "",
        description: "",
        fileUrl: "",
        designParameters:[""],
    });
    const token=localStorage.getItem("token");
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);

    // Load categories from backend to populate dropdown (optional)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
                console.log(res.data.allCategories);
                setCategories(res.data.allCategories); // assuming data is array of { _id, name }
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
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/models`, formData, {
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
                modelName: "",
                typeName: "",
                description: "",
                fileUrl: "",
                designParameters: [""],
            });
        } catch (error) {
            setMessage("Failed to add model.");
            console.error(error);
        }
    };
    const addinput=()=>{
        setFormData(prev=>({
            ...prev,
            designParameters:[...prev.designParameters,""]
        }))
    }
    const handleInputChange = (index, value) => {
        const updatedInputs = [...formData.designParameters];
        updatedInputs[index] = value;
        setFormData(prev => ({
            ...prev,
            designParameters: updatedInputs
        }));
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
                        name="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">Select Type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
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
                <div className="inputs">
                    <label>Required Inputs:</label>
                    {formData.designParameters && formData.designParameters.map((val, index) => (
                        <input
                            key={index}
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder={`Input ${index + 1}`}
                            style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
                        />
                    ))}
                    <button type="button" onClick={addinput} style={{ marginTop: "10px" }}>
                        Add another input
                    </button>
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
