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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from "../contexts/themeContext";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DrawIcon from '@mui/icons-material/Draw';
import DownloadIcon from '@mui/icons-material/Download';

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
    const allFilled = model.designParameters?.every(param => inputValues[param.parameter]);
    const {theme}=useTheme();

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
            <h1 style={{color:"var(--text-primary)"}}>Loading Model details.....</h1>
        ) : (
            <>

            <div className="model-header-container">
                <div className="model-titlebox">
                    <div className="model-titlediv">
                        <h1 className="model-title">{model.modelName}&nbsp;</h1>
                        {!isApproved?
                        <span><p style={{backgroundColor:"#cccccc55", fontSize:"1.6rem", padding:"0.4rem 0.8rem", borderRadius:"1.2rem"}}>{model.status}</p></span>:
                        <div onClick={(e) => e.stopPropagation()} className="savebtn" style={{padding:"1.5rem 0 0 0"}}>
                            <SaveButton modelId={model._id} savedModels={user?.savedModels || []} token={token} refreshFavorites={getThisModel} theme={theme}/>
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
                    <span style={{ color: "var(--secondary-blue)", marginLeft: "10px", fontWeight: "bold" }}>
                        <p style={{userSelect:"none"}}>Recently Added</p>
                    </span>
                    )}

                    <div onClick={(e) => {handleShare(e, model)}} style={{cursor:"pointer"}}>
                        <ShareIcon style={{color:"var(--text-primary)",fontSize:"32"}}/>
                    </div>
                    
                    <button onClick={scrollToCustomization} className="model-customize-scrollerbtn">
                       Design model &nbsp; <DrawIcon style={{fontSize:"24"}}/>
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
                                    <a href={model.fileUrl} target="_blank" rel="noreferrer">Original File <CloudDownloadIcon style={{fontSize:"30"}}/></a>
                                </button>
                            }
                        </div>

                        <div onClick={(e)=>e.stopPropagation()} className="modelEach-controls">
                            <div>
                            {isAdmin && model.status === "pending" && (
                                <>
                                <button className="modelEach-button" onClick={(e) => {updateStatus(e,"approved")}}>Approve</button>
                                <button className="modelEach-button" onClick={(e) => {updateStatus(e,"rejected");}}>Reject</button>
                                </>
                            )}
                            {isAdmin && model.status == "approved" && (
                                <button className="modelEach-button" onClick={(e) => {updateStatus(e,"pending")}}>UnApprove</button>
                            )}
                            {isOwner && model.status == "rejected" && (<>
                                <button className="modelEach-button"onClick={(e) => {updateStatus(e,"pending")}}>Send for re-verification</button></>
                            )}
                            </div>
                                        
                            {/* Owner or Admin buttons */}
                            {(isOwner || isAdmin) && (
                                <div>
                                <button className="modelEach-button" onClick={(e)=>{navigate(`/models/${model._id}/edit`);}}><EditIcon style={{fontSize:"23"}}/>Edit</button>
                                <button className="modelEach-button" style={{backgroundColor:"black"}} onClick={(e) => {deleteModel(model._id);}}><DeleteIcon style={{fontSize:"25"}}/>Delete</button>
                                </div>
                            )}

                        </div>

                        <div className="model-description-body">
                            <p className="model-about">{model.description || "No description available for this model"}</p>
                        </div>

                        <div className="model-engagement">
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Downloads</p>
                                <DownloadSection designCount={model.designCount} theme={theme}/>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Likes</p>
                                <LikeButton modelId={model._id} userId={user?._id} initialLikes={model.likes} token={token} size={"large"} theme={theme}/>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                                <p>Views</p>
                                <ViewsSection viewCount={model.views.length} theme={theme}/>
                            </div>
                        </div>

                    </div>
                    
                </div>

                <div className="model-specifics">
                    <div className="model-specifications">
                        <h2 className="model-specifics-heading">Specifications</h2>
                        {model.specifications?.length > 0 ? (
                            model.specifications.map((specification, index) => (
                                <p key={index} className="model-spec-item">{specification}</p>
                            ))
                        ) : (
                            <p>No specifications provided for the model</p>
                        )}
                    </div>
                    
                    <div className="model-prerequisites">
                        <h2 className="model-specifics-heading">Prerequisite components</h2>
                        {model.prerequisites.length > 0 ? (
                            model.prerequisites.map((prerequisite, index) => (
                                <p key={index} className="model-spec-item">{prerequisite.name}</p>
                            ))
                        ) : (
                            <p>No prerequisite components for the model</p>
                        )}
                    </div>
                </div>

                <button onClick={handleCustomizationButton} className="customization-toggler">
                    {viewCustomization?"Hide Customization":"Design model" }
                    &nbsp;&nbsp; <DrawIcon style={{fontSize:"24"}}/>
                </button>

                <div className={`model-customization-accordion ${viewCustomization ? "open" : ""}` }
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
                            </a><DownloadIcon style={{fontSize:"25"}}/></button>}
                    </div>
                    
                </div>
            </div>

            <div className="model-footer-container">
                
            </div>
            </>
            )}
        </div>
        </div>
    );
}
export default EachModel;