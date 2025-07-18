import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "../Styles/modelEach.css";
import {notify} from "../features/toastManager";
import SaveButton from "../features/engagement/saveModel";
import LikeButton from "../features/engagement/LikeSection";
import ViewsSection from "../features/engagement/viewsSection";
import DownloadSection from "../features/engagement/downloadSection";

const EachModel=()=>{
    const {id}= useParams();
    const { user,token } = useAuth();
    const navigate=useNavigate();
    const [model,setModel]=useState({});
    const [got,setGot]=useState(false);
    const [viewCustomization,setViewCustomization]=useState(false);
    const [inputValues,setInputValues]=useState({});
    const [cloudinaryUrl,setCloudinary]=useState("");
    const [fileGenerated,setFileGenerated]=useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const getThisModel = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}`);

            if (res.data.found) {
                const pmodel = res.data.model;
                setModel(pmodel);
                setGot(true);
                // Decode and set permissions
                setIsAdmin(user?.role === "admin");
                setIsOwner(pmodel.createdBy._id === user?._id);
                
                //Updating views if user logged in
                if(token){
                    try{
                        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}/view`,{},{
                            headers:{Authorization:`Bearer ${token}`},
                            withCredentials:true
                        });
                    }catch(err){
                        console.error("Error updating views", err);
                    }  
                }
                              
            }
        } catch (err) {
            console.error("Error fetching model:", err);
            notify.error("Error fetching model ")
        }
    };

    const handleCustomizationButton=(e)=>{
        if(user){
            setViewCustomization(!viewCustomization)
        }else{
            notify.warning("Please login to customize model");
        }
    }

    const handleInputValueChange=(e)=>{
        const {name,value}=e.target;
        setInputValues(prev=>({...prev,[name]:value}));
    }

    const generateModel=async()=>{
        const calc2=[];
        for(const each of model.calcParams){
            calc2.push(each.compName);
        }
        const relations=model.relations;

        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/userfile`,{model,inputValues,calc2,relations},{
            withCredentials:true,
            headers:{ Authorization: `Bearer ${token}` }
        })
        if(res.data.success){
            setFileGenerated(true);
            setCloudinary(res.data.cloudinaryUrl);
            setModel((prevmodel)=>({
                ...prevmodel,
                designCount:(prevmodel.designCount||0)+1
            }));
        }
    }

    const deleteModel = async (modelId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/models/${modelId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(`${model.modelName} model delted successfully`);
            navigate("/models");
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
            getThisModel();
        }catch (err) {
            console.error("Error updating model status", err);
            notify.error("Error updating model status")
        }
        
    }

    useEffect(() => {
            getThisModel();
    }, [user, token]);


    return(
        <div style={{ padding: "20px" }} className="allPages">
        <div className="model-view-page">
            
        {!got ? (
            <p>Loading model.....</p>
        ) : (
            <>

            <div className="model-header-container">
                <div className="model-titlebox">
                    <h1 className="model-title">{model.modelName}</h1>
                    
                    <div className="model-owner">
                        <img src={model.createdBy.profilePic.url} alt="dp" className="model-owner-preview" />
                        <div className="model-owner-details">
                            <p className="model-owner-name" style={{fontSize:"1.8rem"}}>{model.createdBy.name}</p>
                            <p className="model-owner-contributions" style={{fontSize:"1.2rem"}}>4 contributions</p>
                        </div>
                    </div>
                </div>

                <div className="model-interactbox">
                    {/* Save model button with icon, customize model down point, tags*/}
                        <div onClick={(e) => e.stopPropagation()} className="savebtn">
                            <SaveButton modelId={model._id} savedModels={user?.savedModels || []} token={token} refreshFavorites={getThisModel}/>
                            Save model
                        </div>
                    <button>
                        Customize model
                    </button>
                    {model.status!=="approved"&&
                    <p>{model.status}</p>
                    }<br/>
                    {new Date(model.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                        <span style={{ color: "green", marginLeft: "10px", fontWeight: "bold" }}>
                        Recently Added,<br />
                        {new Date(model.createdAt).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            <div className="model-content-container">
                <div className="model-details">
                    <div className="model-preview">
                        <img
                            src={model.previewImg?.url}
                            alt={model.modelName}
                            className="model-preview-img"
                        />
                    </div>

                    <div className="model-description">
                        

                        <div>{model.typeName}</div>

                        {(isAdmin||isOwner)&&
                        <div>
                            <a href={model.fileUrl} target="_blank" rel="noreferrer">Download original file</a>
                        </div>
                        }

                        <div><strong>Description: </strong>{model.description || "N/A"}</div>

                        <div className="model-engagement">
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Downloads</p>
                                <DownloadSection designCount={model.designCount}/>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Likes</p>
                                <LikeButton modelId={model._id} userId={user?._id} initialLikes={model.likes} token={token} size={"large"}/>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Views</p>
                                <ViewsSection viewCount={model.views.length}/>
                            </div>
                        </div>

                    </div>
                    
                </div>

                <div className="model-customization">
                    
                    <div className="customization">
                        {!viewCustomization && <button onClick={handleCustomizationButton}>Customize this model</button>}
                        {viewCustomization && <button onClick={handleCustomizationButton}>Back</button>}
                        <div className="fields">
                            {viewCustomization && 
                                <>  
                                    {model.designParameters.length>0 &&
                                        <div className="options" style={{display:"flex",flexDirection:"column",width:"15rem"}}>
                                            {
                                                model.designParameters.map((value,index)=>(<React.Fragment key={index}>
                                                    <label>{value.parameter}</label>
                                                    <input type="number" name={value.parameter} value={inputValues[value.parameter] || ""} onChange={handleInputValueChange} key={index} min={value.lowerLimit} max={value.upperLimit}/></React.Fragment>
                                                ))
                                            }
                                        </div>
                                    }
                                </>
                            }
                        </div>

                        {viewCustomization && <button onClick={()=>generateModel()}>Generate Customized model</button>}
                        {fileGenerated && <a href={cloudinaryUrl}>Download File</a>}
                    </div>
                </div>

            </div>

            <div className="model-footer-container">
                <div className="model-controls">
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
                </div>
            </div>
            </>
            )}
        </div>
        </div>
    );
}
export default EachModel;