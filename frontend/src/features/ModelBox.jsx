import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/modelBox.css";
import { useAuth } from "../contexts/authContext"; // use context
import {notify} from "../features/toastManager"
import SaveButton from "./engagement/saveModel"
import LikeButton from "./engagement/LikeSection";
import ViewsSection from "./engagement/viewsSection"
import ShareIcon from '@mui/icons-material/Share';
import { useTheme } from "../contexts/themeContext";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ModelBox=(({model, onDelete})=>{
    const navigate = useNavigate();
    const { user, token, emitPrivateMessage } = useAuth(); //get current user and token
    const [pmodel,setModel]=useState({});

    const isAdmin= user?.role==="admin";
    const isOwner = model?.createdBy?._id === user?._id;
    const currUserId=user?._id;
    const {theme}=useTheme();
    const color = (theme==="dark-theme")?"white":"grey";
    const [AdminArr,setAdminArr] = useState([]); 

    const deleteModel = async (modelId) => {
        try {
            const res=await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/models/${modelId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.data.deleted){
                const id =import.meta.env.VITE_PUBLIC_ROOM;
                let updateMessage=`Your model "${model.modelName}" is deleted by ${user.name} `;
                
                emitPrivateMessage(
                    user.name,
                    updateMessage,
                    id,
                    model.createdBy._id,
                );
                notify.success(`${model.modelName} deleted successfully`);
                onDelete();
            }
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
            if(res.data.updated){
                const roomId =import.meta.env.VITE_PUBLIC_ROOM;
                let statusMessage=`Your model "${model.modelName}" is ${newStatus} `;
                let adminMesssage=`Model ${model.modelName} is waiting for approval (Sent for Re-Verification by ${user.name})`;

                if(newStatus==="pending"){
                    if(model.status==="approved"){
                        statusMessage=`Your model "${model.modelName}" is unapproved `;//if previous status changes approved--->pending
                    }
                    if(model.status==="rejected"){
                        statusMessage=`Your model "${model.modelName}" is sent for Re-Verification `;

                        AdminArr.forEach((p) => {//message to all Admins
                            emitPrivateMessage(
                                user.name,
                                adminMesssage,
                                roomId,
                                p,
                            );
                        });
                    }
                }
                emitPrivateMessage(
                    user.name,
                    statusMessage,
                    roomId,
                    model.createdBy._id,
                );
                onDelete();
            }
        }catch (err) {
            console.error("Error updating model status", err);
            notify.error("Error updating model status")
        }
        
    }
    const getData=async()=>{
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/${model._id}`,{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true
        });
        if(res.data.found){
            setModel(res.data.model);
        }
    }
    useEffect(()=>{
        getData();
        const fetchAdminIds=async ()=>{
            try{
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/admins`,{
                headers: { Authorization: `Bearer ${token}` }
            });
            setAdminArr(res.data.adminIds);
            } catch (error) {
                console.error("Error fetching adminIds", error);
            }
        }
        fetchAdminIds();
    },[]);
    
    const handleShare = async (e, model) => {
        e.stopPropagation();
        e.preventDefault();
        
        const modelUrl = `${window.location.origin}/models/${model._id}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: model.modelName,
                    text: "Check out this model on our platform!",
                    url: modelUrl,
                });
            } catch (err) {
                console.error("Sharing failed:", err);
            }
        } else {
            // Fallback: copy link to clipboard
            try {
                await navigator.clipboard.writeText(modelUrl);
                notify.success("Link copied to clipboard!");
            } catch (err) {
                console.error("Clipboard write failed:", err);
                notify.error("Could not copy link");
            }
        }
    };


    return(
        <div className="modelBox"
            onClick={() => navigate(`/models/${model._id}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
            <div className="modelbox-preview">
                <img
                    className="modelbox-preview-img"
                    src={model.previewImg?.url}
                    alt={model.modelName}
                />
            </div>

            <div className="modelbox-content">
                <div className="modelDes">
                    <div className="modelbox-owner" >
                        <img src={pmodel?.createdBy?.profilePic?.url} alt="dp" className="modelbox-owner-preview" title={"owned by " + pmodel?.createdBy?.name}/>
                    </div>
                    <div className="modelbox-description">
                        <h4>{model.modelName}</h4>
                        <p>{model.typeName}</p>
                    </div>  
                </div>
                  

                <div className="modelbox-engagement">
                    <div className="modelbox-engagement-allaccess">
                        {user&&
                            <div onClick={(e) => e.stopPropagation()} className="savebtn">
                                <SaveButton modelId={model._id} savedModels={user?.savedModels || []} token={token} refreshFavorites={onDelete} size={"small"} theme={theme}/>
                            </div>
                        }
                        <div onClick={(e) => e.stopPropagation()}>
                            <LikeButton modelId={model._id} userId={currUserId} initialLikes={model.likes} token={token} size={"small"} theme={theme}/>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <ViewsSection viewCount={model.views.length} size={"small"} theme={theme}/>
                        </div>
                        <div onClick={(e) => {handleShare(e, model)}} >
                            <ShareIcon sx={{color:{color}}} style={{fontSize:"22"}}/>
                        </div>
                    </div>
                    {isOwner && model.status == "rejected" && (
                        <p>Model is rejected</p>
                    )}
                </div>  
            </div>

            <div onClick={(e)=>e.stopPropagation()} className="modelbox-controls">
                <div>
                {isAdmin && model.status === "pending" && (
                    <>
                    <button className="model-button" onClick={(e) => {updateStatus(e,"approved")}}>Approve</button>
                    <button className="model-button" onClick={(e) => {updateStatus(e,"rejected");}}>Reject</button>
                    </>
                )}
                {isAdmin && model.status == "approved" && (
                    <button className="model-button" onClick={(e) => {updateStatus(e,"pending")}}>UnApprove</button>
                )}
                {isOwner && model.status == "rejected" && (
                    <button className="model-button"onClick={(e) => {updateStatus(e,"pending")}}>Send for re-verification</button>
                )}
                </div>
                            
                {/* Owner or Admin buttons */}
                {(isOwner || isAdmin) && (
                    <div>
                    <button className="model-button" onClick={(e)=>{navigate(`/models/${model._id}/edit`);}}><EditIcon style={{fontSize:"16"}}/>Edit</button>
                    <button className="model-button" onClick={(e) => {deleteModel(model._id);}}><DeleteIcon style={{fontSize:"16"}}/>Delete</button>
                    </div>
                )}

            </div>
        </div>
    )
})

export default ModelBox;