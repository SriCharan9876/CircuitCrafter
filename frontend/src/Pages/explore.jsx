import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Explore = () => {
    const token = localStorage.getItem("token");
    const [allModels, setAllModels] = useState([]);
    const navigate=useNavigate();
    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getModels`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === "Success") {
                setAllModels(res.data.allModels);
            } else {
                alert("Failed to fetch models");
            }
        } catch (err) {
            console.error("Error fetching models:", err);
            alert("Error occurred while fetching models");
        }
    };

    useEffect(() => {
        getModels();
    }, []);
    const handleNavigate=(model)=>{
        navigate(`/explore/${model}`);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Models</h1>
            {allModels.length === 0 ? (
                <p>No models found.</p>
            ) : (
                allModels.map((model) => (
                    <div
                        key={model._id}
                        style={{
                            width: "98%",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px",
                            cursor:"pointer"
                        }}
                        onClick={()=>handleNavigate(model._id)}
                    >
                        <h2>{model.modelName}</h2>
                        <p><strong>Type:</strong> {model.typeName}</p>
                        {/* <p><strong>Description:</strong> {model.description || "N/A"}</p> */}
                        {/* <p><strong>File URL:</strong> <a href={model.fileUrl} target="_blank" rel="noreferrer">{model.fileUrl}</a></p> */}
                        <p><strong>Owned By:</strong> {model.createdBy.name}</p>
                        {/* <p><strong>Approved:</strong> {model.approved ? "Yes" : "No"}</p> */}
                        {/* <p><strong>Created At:</strong> {new Date(model.createdAt).toLocaleString()}</p> */}
                    </div>
                ))
            )}
        </div>
    );
};

export default Explore;
