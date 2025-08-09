import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"
import AscFileUploadBox from "../features/AscFileUpload"

const AddCategory = () => {
    const navigate=useNavigate();
    const { user, token } = useAuth();
    const initialFormData={
        name: "",
        label: "",
        description: ""
    }
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            notify.error("Login as admin");
            navigate("/login");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.type.startsWith("image/")) {
            setMessage("Only image files are allowed for category thumbnail.");
            setFile(null);
        } else {
            setFile(selectedFile);
            setMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let visual=null;
            if(file){
                const imageForm = new FormData();
                imageForm.append("file", file);
                const imageUploadRes = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/files/category`,
                    imageForm,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );

                const { public_id, url } = imageUploadRes.data;
                visual={ public_id, url }
            }
            
            const categoryPayload = visual? { ...formData, visual }:formData;

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`,categoryPayload,{
                    withCredentials: true,
                    headers:{Authorization:`Bearer ${token}`}
                }
            );
            if(res.data.added){
                setMessage("Category added successfully!");
            }else{
                setMessage("Category failed to add!");
            }
            setFormData(initialFormData);
        } catch (error) {
            setMessage("Failed to add category.");
            console.error(error);
        }
    };

    return (
        <div className="allPages">
            <div style={{ padding:"0 28%"}} className="addcategory-page">
                <h2 style={{textAlign:"center", color:"var(--text-primary)"}}>Create category</h2>
                <form onSubmit={handleSubmit} className="addmodel-form">
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

                    <div>
                        <label>Upload the category thumbnail image</label>
                        <AscFileUploadBox file={file} setFile={setFile} />
                    </div>

                    {file && (
                    <div >
                        <img src={URL.createObjectURL(file)} alt="Preview" style={{width:"450px"}} />
                    </div>
                    )}

                    <button type="submit" className="addmodel-navigate-btn" style={{marginLeft:"40%"}} disabled={!formData.name || !formData.label}>
                        Submit
                    </button>
                </form>

                {message && <p style={{ marginTop: "20px" }}>{message}</p>}
            </div>
        </div>
    );
};

export default AddCategory;
