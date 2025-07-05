import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ModelBox from "../features/ModelBox";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Explore = () => {
    const token = localStorage.getItem("token");
    const navigate=useNavigate();
    const [allModels, setAllModels] = useState([]);

    //Get category query if exists
    const location = useLocation(); // Get current URL info
    const queryParams = new URLSearchParams(location.search); // return function to search in parsed query string (?key=value)
    const selectedCategory = queryParams.get("category"); // Get value of 'category' param

    //Getting current user information using jwt_decode
    let currentUser={};
    if(token){
        try{
            currentUser=jwtDecode(token);
        }catch(e){
            console.error("Error in loading current user information");
        }
    }
    const isAdmin=currentUser.role=="admin";

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

    useEffect(() => {
        getModels();
    }, []);

    const pendingModels=async()=>{
        navigate("/models/pending")
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>All Models</h1>
            {isAdmin&&(
                <button onClick={()=>pendingModels()}>Models to be Approved</button>
            )}

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
