import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { get } from "mongoose";
const Explore=()=>{
    const token=localStorage.getItem("token");
    const [allModels,setAllModels]=useState([]);
    const getModels=async()=>{
        const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/getModels`,{
            withCredentials:true,
            headers:{Authorization:`Bearer ${token}`},
        })
        if(res.data.message=="Success"){
            setAllModels(res.data.allModels);
            alert("success");
        }else{
            alert("failed to fetch");
        }
    }
    useEffect(()=>{
        getModels();
    },[]);
    return(
        <h1>Models</h1>
    )
}
export default Explore;
