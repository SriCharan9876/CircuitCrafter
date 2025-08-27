import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelBox from "../features/ModelBox";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"


const MyModels = () => {
    const { token } = useAuth();
    const [allModels, setAllModels] = useState([]);

    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/mymodels`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.message === "Success") {
                setAllModels(res.data.allModels);
            } else {
                notify.error("Failed to fetch models")
            }
        } catch (err) {
            console.error("Error fetching models:", err);
            notify.error("Error occurred while fetching models")
        }
    };

    useEffect(() => {
        getModels();
    }, []);
    

    return (
        <div className="allPages">
            <div className="mymodels-page" style={{padding:"4rem 2rem"}}>
                <h1 style={{textAlign:"center", marginBottom:"3rem", color:"var(--text-primary)"}}>Explore your models</h1>
                <div className="model-grid">
                {allModels.length === 0 ? (
                    <h1 style={{color:"var(--text-primary)"}}>Loading your models.....</h1>
                ) : (
                    allModels.map((model) => (
                        <ModelBox model={model} key={model._id} onDelete={getModels}/>
                    ))
                )}
                </div>
            </div>
        </div>
    );
};

export default MyModels;
