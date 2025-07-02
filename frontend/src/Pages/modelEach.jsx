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
    const [inputValues,setInputValues]=useState([]);
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
        const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/generate`,{pmodel,inputValues},{
            withCredentials:true,
            headers:{Authorization:`Bearer ${token}`}
        })
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
                        <p><strong>Approved:</strong> {pmodel.approved ? "Yes" : "No"}</p>
                        <p><strong>Created At:</strong> {new Date(pmodel.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="customization">
                        <button onClick={clickedbut}>Customize this model</button>
                        <div className="fields">
                            {clicked && 
                                <>  
                                    {pmodel.requiredInputs &&
                                        <div className="options" style={{display:"flex",flexDirection:"column",width:"15rem"}}>
                                            {
                                                pmodel.requiredInputs.map((value,index)=>(<React.Fragment key={index}>
                                                    <label>{value}</label>
                                                    <input type="text" name={value} value={inputValues[value] || ""} onChange={handleInputValueChange} key={index}/></React.Fragment>
                                                ))
                                            }
                                        </div>
                                    }
                                </>
                            }
                        </div>
                        {clicked && <button onClick={()=>generateModel()}>Generate Customized model</button>}
                    </div>
                    </>
            )}
        </div>
    );
}
export default EachModel;