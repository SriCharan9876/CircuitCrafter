import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
                        <p><strong>Owned By:</strong> {model.createdBy.name}</p>

                        {isAdmin && model.status === "pending" && (
                            <>
                            <button>Approve</button>
                            <button>Reject</button>
                            </>
                        )}
                        {isAdmin && model.status !== "pending" && (
                            <button>UnApprove</button>
                        )}
                        
                        {/* Owner or Admin buttons */}
                        {(isOwner || isAdmin) && (
                            <>
                            <button>Edit</button>
                            <button
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