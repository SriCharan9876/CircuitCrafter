import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../Styles/modelBox.css";

const ModelBox=(({model, onDelete})=>{
    const navigate = useNavigate();

    //Getting current user information using jwt_decode
    const token=localStorage.getItem("token");
    let currentUser={};
    if(token){
        try{
            currentUser=jwtDecode(token);
        }catch(e){
            console.error("Error in loading current user information");
        }
    }
    const isAdmin=currentUser.role=="admin";
    const isOwner=model.createdBy._id==currentUser.userId;


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
    const unApproveModel=async()=>{
        const status="pending";
        const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${model._id}/status`,{status},{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true
        });
        onDelete();
    }
    const ApproveModel=async()=>{
        const status="approved";
        const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${model._id}/status`,{status},{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true
        });
        onDelete();
    }

    const rejectModel=async()=>{
        const status="rejected";
        const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${model._id}/status`,{status},{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true
        });
        onDelete();
    }
    const handleEdit=async()=>{
        navigate(`/models/${model._id}/edit`);
    }
    return(
        <div
                          className="modelBox"
                          key={model._id}
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "16px",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s",
                            cursor: "pointer"
                          }}
                          onClick={() => handleNavigate(model._id)}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        >
                        <h2>{model.modelName}</h2>
                        <p><strong>Type:</strong> {model.typeName}</p>
                        <p><strong>Owned By:</strong> {model.createdBy.name}</p>

                        {isAdmin && model.status === "pending" && (
                            <>
                            <button
                                className="model-button"
                                onClick={(e) => {
                                e.stopPropagation();
                                ApproveModel();
                                }}>Approve
                            </button>
                            <button
                                className="model-button"
                                onClick={(e) => {
                                e.stopPropagation();
                                rejectModel();
                                }}>Reject
                            </button>
                            </>
                        )}
                        {isAdmin && model.status == "approved" && (
                            <button
                                className="model-button"
                                onClick={(e) => {
                                e.stopPropagation();
                                unApproveModel();
                                }}>UnApprove
                            </button>
                        )}
                        {isOwner && model.status == "rejected" && (<>
                            <p>Model is rejected</p>
                            <button
                                className="model-button"
                                onClick={(e) => {
                                e.stopPropagation();
                                unApproveModel();
                                }}>Send for re-verification
                            </button></>
                        )}
                        
                        {/* Owner or Admin buttons */}
                        {(isOwner || isAdmin) && (
                            <>
                            <button 
                                className="model-button"
                                onClick={(e)=>{
                                e.stopPropagation();
                                handleEdit()}}>Edit</button>
                            <button
                                className="model-button"
                                onClick={(e) => {
                                e.stopPropagation();
                                deleteModel(model._id);
                                }}>Delete
                            </button>
                            </>
                        )}

                    </div>
    )
})

export default ModelBox;