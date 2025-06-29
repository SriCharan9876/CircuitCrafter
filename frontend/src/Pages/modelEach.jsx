import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const EachModel=()=>{
    const {id}= useParams();
    const [pmodel,setmodel]=useState();
    const [got,setgot]=useState(false);
    const token=localStorage.getItem("token");
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
    return(
        <div style={{ padding: "20px" }}>
            <h1>Model</h1>
            {!got ? (
                <p>No models found.</p>
            ) : (
                // allModels.map((model) => (
                    <div
                        key={pmodel._id}
                        style={{
                            width: "98%",
                            // border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "20px"
                        }}
                    >
                        <h2>{pmodel.modelName}</h2>
                        <p><strong>Type:</strong> {pmodel.typeName}</p>
                        <p><strong>Description:</strong> {pmodel.description || "N/A"}</p>
                        <p><strong>File URL:</strong> <a href={pmodel.fileUrl} target="_blank" rel="noreferrer">{pmodel.fileUrl}</a></p>
                        <p><strong>Created By:</strong> {pmodel.createdBy.name}</p>
                        <p><strong>Approved:</strong> {pmodel.approved ? "Yes" : "No"}</p>
                        <p><strong>Created At:</strong> {new Date(pmodel.createdAt).toLocaleString()}</p>
                    </div>
                // ))
            )}
        </div>
    );
}
export default EachModel;