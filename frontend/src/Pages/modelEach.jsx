import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import "../Styles/modelEach.css";
import {notify} from "../features/toastManager";
import SaveButton from "../features/engagement/saveModel";
import LikeButton from "../features/engagement/LikeSection";
import ViewsSection from "../features/engagement/viewsSection";
import DownloadSection from "../features/engagement/downloadSection";
import ShareIcon from '@mui/icons-material/Share';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EachModel=()=>{
    const {id}= useParams();
    const { user,token } = useAuth();
    const navigate=useNavigate();
    const customizationRef = useRef(null); 
    const [model,setModel]=useState({});
    const [got,setGot]=useState(false);
    const [viewCustomization,setViewCustomization]=useState(false);
    const [inputValues,setInputValues]=useState({});
    const [cloudinaryUrl,setCloudinary]=useState("");
    const [fileGenerated,setFileGenerated]=useState(false);
    const [generating, setGenerating] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const isApproved = model.status === "approved";
    const isPending = model.status === "pending";
    const isRejected = model.status === "rejected";
    const allFilled = model.designParameters?.every(param => inputValues[param.parameter]);

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
            notify.error(err.response?.data?.message || "Something went wrong");
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
        setGenerating(true);
        try{
            const calc2 = model.calcParams.map(each => each.compName);
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
                notify.success("File generated successfully");
            }
        } catch (err) {
            notify.error("Failed to generate file");
            console.error(err);
        } finally {
            setGenerating(false);
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
            notify.success(`${model.modelName} deleted successfully`);
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

    const scrollToCustomization = () => {
        if (customizationRef.current) {
            customizationRef.current.scrollIntoView({ behavior: "smooth" });
            setViewCustomization(true);
        }
    };

    useEffect(() => {
        getThisModel();
    }, [id,user]);

    useEffect(()=>{
        if (user && model?.createdBy) {
            setIsAdmin(user.role === "admin");
            setIsOwner(model.createdBy._id === user._id);
        }
    })

    return(
        <div style={{ padding: "20px" }} className="allPages">
        <div className="model-view-page">
            
        {!got ? (
            <p>Loading model.....</p>
        ) : (
            <>

            <div className="model-header-container">
                <div className="model-titlebox">
                    <div className="model-titlediv">
                        <h1 className="model-title">{model.modelName}</h1>
                        {!isApproved?
                        <span><p>{model.status}</p></span>:
                        <div onClick={(e) => e.stopPropagation()} className="savebtn" style={{padding:"1.5rem 0 0 0"}}>
                            <SaveButton modelId={model._id} savedModels={user?.savedModels || []} token={token} refreshFavorites={getThisModel}/>
                        </div>
                        }
                    </div>

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

                    {new Date(model.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <span style={{ color: "green", marginLeft: "10px", fontWeight: "bold" }}>
                        <p style={{userSelect:"none"}}>Recently Added</p>
                    </span>
                    )}

                    <div onClick={(e) => {handleShare(e, model)}} style={{cursor:"pointer"}}>
                        <ShareIcon style={{color:"grey",fontSize:"32"}}/>
                    </div>
                    
                    <button onClick={scrollToCustomization} className="model-customize-scrollerbtn">
                        Customize model
                    </button>

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

                        <div className="model-description-head">
                            <div className="model-categoryname"><p><strong>Category:</strong>&nbsp;&nbsp;{model.typeName}</p></div>

                            {(isAdmin||isOwner)&&
                                <button className="model-originalfile-btn">
                                    <a href={model.fileUrl} target="_blank" rel="noreferrer">Download original file</a>
                                </button>
                            }
                        </div>

                        <div className="model-description-body">
                            <p className="model-about">{model.description || "No description available for this model"}</p>
                        </div>

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

                <button onClick={handleCustomizationButton} className="customization-toggler">
                    {viewCustomization?"Hide Customization":"Customize model"}
                </button>

                <div className={`model-customization-accordion ${viewCustomization ? "open" : ""}`}
                        ref={customizationRef}>

                    <div className="customization-header">
                        <p>Design your model</p>
                    </div>
                    
                    <div className="customization-input-section" >
                        {viewCustomization && model.designParameters.length>0 &&
                            <div className="customization-input-fields">
                                {model.designParameters.map((value,index)=>(
                                <div key={index} className="customization-input-field">
                                    <label>
                                        {value.parameter? value.parameter.charAt(0).toUpperCase() + value.parameter.slice(1): ''}
                                    </label>
                                    <input type="number" 
                                        name={value.parameter} 
                                        value={inputValues[value.parameter] || ""} 
                                        onChange={handleInputValueChange} 
                                        min={value.lowerLimit} 
                                        max={value.upperLimit}/>
                                </div>))
                                }
                            </div>
                        }
                    </div>

                    <div className="customization-buttons">
                        {viewCustomization && 
                            <button onClick={()=>generateModel()}  className="customization-generate-btn" disabled={!allFilled}>
                                {generating ? (
                                    <>
                                    Generating...<CircularProgress size={20} color="inherit" />
                                    </>
                                ) : fileGenerated?(
                                    <>
                                    Regenerate<CheckCircleIcon style={{ color: "white" }} />
                                    </>
                                ):(
                                    <>
                                    Generate<AutoAwesomeIcon></AutoAwesomeIcon>
                                    </>
                                )}
                            </button>}
                        {fileGenerated && 
                            <button className="model-download-btn">
                                <a href={cloudinaryUrl}>
                                Download File
                            </a></button>}
                    </div>
                    
                </div>
            </div>

            <div className="model-footer-container">
                <div className="model-controls">
                    <div onClick={(e)=>e.stopPropagation()} className="modelBoxButtons">
                    {isAdmin && isPending && (
                        <>
                        <button className="model-button" onClick={(e) => {updateStatus(e,"approved")}}>Approve</button>
                        <button className="model-button" onClick={(e) => {updateStatus(e,"rejected");}}>Reject</button>
                        </>
                    )}
                    {isAdmin && isApproved && (
                        <button className="model-button" onClick={(e) => {updateStatus(e,"pending")}}>UnApprove</button>
                    )}
                    {isOwner && isRejected && (<>
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