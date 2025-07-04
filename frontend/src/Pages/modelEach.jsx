import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EachModel=()=>{
    const token=localStorage.getItem("token");
    const {id}= useParams();
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

            // Decode and set permissions
            if (token) {
                try {
                const currentUser = jwtDecode(token);
                setIsAdmin(currentUser.role === "admin");
                setIsOwner(model.createdBy._id === currentUser.userId);
                } catch (e) {
                console.error("JWT decode error:", e);
                }
            }
            }
        } catch (err) {
            console.error("Error fetching model:", err);
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
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/generate`,{pmodel,inputValues,calc2,relations},{
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

    useEffect(()=>{
        getThisModel();
    },[]);

    return(
        <div style={{ padding: "20px" }}>
            <h1>Model</h1>
            {!got ? (
                <p>Loading model.....</p>
            ) : (
                <>
                    <div
                        key={pmodel._id}
                        style={{
                            width: "98%",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px"
                        }}
                    >
                        <h2>{pmodel.modelName}</h2>
                        <p><strong>Type:</strong> {pmodel.typeName}</p>
                        <p><strong>Description:</strong> {pmodel.description || "N/A"}</p>
                        <p><strong>File URL:</strong> <a href={pmodel.fileUrl} target="_blank" rel="noreferrer">{pmodel.fileUrl}</a></p>
                        <p><strong>Owned By:</strong> {pmodel.createdBy.name}</p>
                        <p><strong>Status:</strong> {pmodel.status}</p>
                        <p><strong>Created At:</strong> {new Date(pmodel.createdAt).toLocaleString()}</p>
                    </div>

                    {isAdmin && pmodel.status === "pending" && (
                        <>
                        <button>Approve</button>
                        <button>Reject</button>
                        </>
                    )}
                    {isAdmin && pmodel.status !== "pending" && (
                        <button>UnApprove</button>
                    )}
                    
                    {/* Owner or Admin buttons */}
                    {(isOwner || isAdmin) && (
                        <>
                        <button>Edit</button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            deleteModel(pmodel._id);
                            }}>Delete
                        </button>
                        </>
                    )}

                    <div className="customization">
                        <button onClick={clickedbut}>Customize this model</button>
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