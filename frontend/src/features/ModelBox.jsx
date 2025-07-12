import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/modelBox.css";
import { useAuth } from "../contexts/authContext"; // use context
import {notify} from "../features/toastManager"
import SaveButton from "./engagement/saveModel"
import LikeButton from "./engagement/LikeSection";
import ViewsSection from "./engagement/viewsSection"

const ModelBox=(({model, onDelete})=>{
    const navigate = useNavigate();
    const { user, token } = useAuth(); //get current user and token

    const isAdmin=user?.role==="admin";
    const isOwner = model?.createdBy?._id === user?._id;
    const currUserId=user?._id;

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

    const updateStatus=async(e,newStatus)=>{
        e.stopPropagation();
        try{
            const res=await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${model._id}/status`,{status:newStatus},{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true
            });
            onDelete();
        }catch (err) {
            console.error("Error updating model status", err);
            notify.error("Error updating model status")
        }
        
    }

    return(
        <div className="modelBox"
            key={model._id}
            onClick={() => navigate(`/models/${model._id}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
            <h2>{model.modelName}</h2>
            <hr />
            <img
                src={model.previewImg?.url}
                alt={model.modelName}
                style={{
                    width:"200px",
                }}
            />

            <p><strong>Type:</strong> {model.typeName}</p>
            <p><strong>Owned By:</strong> {model.createdBy.name}</p>

            <div onClick={(e)=>e.stopPropagation()} className="modelBoxButtons">
                {isAdmin && model.status === "pending" && (
                    <>
                    <button className="model-button" onClick={(e) => {updateStatus(e,"approved")}}>Approve</button>
                    <button className="model-button" onClick={(e) => {updateStatus(e,"rejected");}}>Reject</button>
                    </>
                )}
                {isAdmin && model.status == "approved" && (
                    <button className="model-button" onClick={(e) => {updateStatus(e,"pending")}}>UnApprove</button>
                )}
                {isOwner && model.status == "rejected" && (<>
                    <p>Model is rejected</p>
                    <button className="model-button"onClick={(e) => {updateStatus(e,"pending")}}>Send for re-verification</button></>
                )}
                            
                {/* Owner or Admin buttons */}
                {(isOwner || isAdmin) && (
                    <>
                    <button className="model-button" onClick={(e)=>{navigate(`/models/${model._id}/edit`);}}>Edit</button>
                    <button className="model-button" onClick={(e) => {deleteModel(model._id);}}>Delete</button>
                    </>
                )}

            </div>

            <div className="engagement-section">
                <div onClick={(e) => e.stopPropagation()}>
                    <LikeButton modelId={model._id} userId={currUserId} initialLikes={model.likes} token={token}/>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <ViewsSection viewCount={model.views.length}/>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                    <SaveButton modelId={model._id} savedModels={user?.savedModels || []} token={token} refreshFavorites={onDelete}/>
                </div>
            </div>
            
        </div>
    )
})

export default ModelBox;