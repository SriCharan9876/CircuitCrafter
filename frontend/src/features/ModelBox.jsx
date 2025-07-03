import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ModelBox=(({model, onDelete})=>{
    const navigate = useNavigate();
    const token=localStorage.getItem("token");
    const handleNavigate=(modelId)=>{
        navigate(`/models/${modelId}`);
    }
    const deleteModel = async (modelId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/models/${modelId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onDelete();
            console.log(`${model.modelName} model delted successfully`);
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
        }
    };

    return(
        <div className="modelBox"
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
                        {model.status=="pending"?
                        <>
                        <button>Approve</button>
                        <button>Reject</button>
                        </>:
                        <>
                        <button>UnApprove</button>
                        </>}
                        
                        <button>Edit</button>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            deleteModel(model._id);
                        }}>Delete</button>

                    </div>
    )
})

export default ModelBox;