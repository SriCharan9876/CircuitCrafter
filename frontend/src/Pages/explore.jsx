import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ModelBox from "../features/ModelBox";
import { useNavigate } from "react-router-dom";
const Explore = () => {
    const token = localStorage.getItem("token");
    const navigate=useNavigate();
    const [allModels, setAllModels] = useState([]);
    const [userData,setUserData]=useState({});

    //Get category query if exists
    const location = useLocation(); // Get current URL info
    const queryParams = new URLSearchParams(location.search); // return function to search in parsed query string (?key=value)
    const selectedCategory = queryParams.get("category"); // Get value of 'category' param


    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models`, {
                params:selectedCategory?{category:selectedCategory}:{},
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === "Success") {
                setAllModels(res.data.allModels);
                console.log(res.data.allModels);
            } else {
                alert("Failed to fetch models");
            }
        } catch (err) {
            console.error("Error fetching models:", err);
            alert("Error occurred while fetching models");
        }
    };

    const getMyData=async()=>{
        try{
            const res=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me`,{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true
            })
            if(res.data.fetched) setUserData(res.data.me);
            console.log(res.data.me);
        }catch(err){
            console.log(err);
        }
    }
    useEffect(() => {
        getModels();
        getMyData();
    }, []);
    const pendingModels=async()=>{
        navigate("/models/pending")
    }
    

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Models</h1>
            {userData.role=="admin" && 
                <button onClick={()=>pendingModels()}>Models to be Approved</button>
            }
            {allModels.length === 0 ? (
                <p>Loading models....</p>
            ) : (
                allModels.map((model) => (
                    <ModelBox model={model} key={model._id} onDelete={getModels}/>
                ))
            )}
        </div>
    );
};

export default Explore;
