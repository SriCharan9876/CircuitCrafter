import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const EachModel=()=>{
    const {id}= useParams();
    const [pmodel,setmodel]=useState();
    const [got,setgot]=useState(false);
    const token=localStorage.getItem("token");
    const [clicked,setClicked]=useState(false);
    const [inputValues,setInputValues]=useState({});
    const [cloudinaryUrl,setCloudinary]=useState("");
    const [success,setSuccess]=useState(false);
    const getThisModel=async()=>{
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}`,{
            withCredentials:true,
            headers:{Authorization:`Bearer ${token}`}
        })
        if(res.data.found){
            setmodel(res.data.pmodel);
            setgot(true);
        }
    }
    useEffect(()=>{
        getThisModel();
    },[]);
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