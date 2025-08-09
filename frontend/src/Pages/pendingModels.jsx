import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelBox from "../features/ModelBox";
import { useNavigate } from "react-router-dom";
import {notify} from "../features/toastManager"
import { useAuth } from "../contexts/authContext";

const PendingModels = () => {
    const { user, token } = useAuth();
    const [allModels, setAllModels] = useState([]);
    const navigate=useNavigate();
    
    useEffect(() => {
        if (!user) return; // wait for auth to initialize
        if (user.role !== "admin") {
        notify.error("Only admin can access this page");
        navigate("/login");
        } else {
        getModels();
        }
    }, [user]);

    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/pending`, {
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
            notify.error("Failed to fetch models");
        }
    };

    return (
        <div style={{ padding: "20px" }} className="allPages">
            <div className="pendingmodel-page" style={{padding:"1rem 3rem", minHeight:"50vh"}}>
                <h1 style={{textAlign:"center", marginBottom:"3rem", color:"var(--text-primary)"}}>Review pending models</h1>
                {allModels.length === 0 ? (
                    <h1 style={{color:"var(--text-primary)"}}>Loading Pending Models.....</h1>
                ) : (
                <div className="model-grid">
                    {allModels.map((model) => (
                        <ModelBox model={model} key={model._id} onDelete={getModels}/>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default PendingModels;
