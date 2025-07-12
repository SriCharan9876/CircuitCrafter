import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "../Styles/modelEach.css"
import {notify} from "../features/toastManager"
import { model } from "mongoose";

const EachModel=()=>{
    const {id}= useParams();
    const { user,token } = useAuth();
    const navigate=useNavigate();
    const [pmodel,setmodel]=useState();
    const [got,setgot]=useState(false);
    const [clicked,setClicked]=useState(false);
    const [inputValues,setInputValues]=useState({});
    const [cloudinaryUrl,setCloudinary]=useState("");
    const [success,setSuccess]=useState(false);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const getThisModel = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.found) {
                const model = res.data.pmodel;
                setmodel(model);
                setgot(true);

                try{
                    await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}/view`,{},{
                        headers:{Authorization:`Bearer ${token}`},
                        withCredentials:true
                    });
                }catch(err){
                    console.error("Error updating views", err);
                    notify.error("Error updating views of model");
                }

                // Decode and set permissions
                setIsAdmin(user?.role === "admin");
                setIsOwner(model.createdBy._id === user?._id);
            }
        } catch (err) {
            console.error("Error fetching model:", err);
            notify.error("Error fetching model")

        }
    };

    const clickedbut=()=>{
        setClicked(!clicked);
    }

    const handleInputValueChange=(e)=>{
        const {name,value}=e.target;
        setInputValues(prev=>({...prev,[name]:value}));
    }

    const generateModel=async()=>{
        console.log(inputValues);
        const calc2=[];
        for(const each of pmodel.calcParams){
            calc2.push(each.compName);
        }
        const relations=pmodel.relations;
        console.log(calc2);
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/userfile`,{pmodel,inputValues,calc2,relations},{
            withCredentials:true,
            headers:{Authorization:`Bearer ${token}`}
        })
        if(res.data.success){
            setSuccess(true);
            setCloudinary(res.data.cloudinaryUrl);
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
            onDelete();
            console.log(`${pmodel.modelName} model delted successfully`);
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

    useEffect(()=>{
        getThisModel();
    },[]);

    return(
        <div style={{ padding: "20px" }} className="allPages">
            <h1>Model</h1>
            {!got ? (
                <p>Loading model.....</p>
            ) : (
                <>
                    <div className="model-details-grid">
                    <div>
                        <img
                            src={pmodel.previewImg?.url}
                            alt={pmodel.modelName}
                            className="preview-image"
                            style={{
                                width:"600px"
                            }}
                        />
                      </div>
                      <br />
                      <div><strong>Model Name: </strong>{pmodel.modelName}</div>
                      <div><strong>Type: </strong>{pmodel.typeName}</div>
                      <div><strong>Description: </strong>{pmodel.description || "N/A"}</div>
                      <div><strong>File URL: </strong>
                        <a href={pmodel.fileUrl} target="_blank" rel="noreferrer">{pmodel.fileUrl}</a>
                      </div>
                      <div><strong>Owned By: </strong>{pmodel.createdBy.name}</div>
                      <div><strong>Status: </strong>{pmodel.status}</div>
                      <div><strong>Created At: </strong>{new Date(pmodel.createdAt).toLocaleString()}</div>
                    </div>
                    <br />

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

                    <div className="customization">
                        {!clicked && <button onClick={clickedbut}>Customize this model</button>}
                        {clicked && <button onClick={clickedbut}>Back</button>}
                        <div className="fields">
                            {clicked && 
                                <>  
                                    {pmodel.designParameters.length>0 &&
                                        <div className="options" style={{display:"flex",flexDirection:"column",width:"15rem"}}>
                                            {
                                                pmodel.designParameters.map((value,index)=>(<React.Fragment key={index}>
                                                    <label>{value.parameter}</label>
                                                    <input type="number" name={value.parameter} value={inputValues[value.parameter] || ""} onChange={handleInputValueChange} key={index} min={value.lowerLimit} max={value.upperLimit}/></React.Fragment>
                                                ))
                                            }
                                        </div>
                                    }
                                </>
                            }
                        </div>
                        {clicked && <button onClick={()=>generateModel()}>Generate Customized model</button>}
                        {success && <a href={cloudinaryUrl}>Download File</a>}
                    </div>
                    </>
            )}
        </div>
    );
}
export default EachModel;