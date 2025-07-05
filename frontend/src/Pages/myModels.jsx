import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelBox from "../features/ModelBox";

const MyModels = () => {
    const token = localStorage.getItem("token");
    const [allModels, setAllModels] = useState([]);

    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/mymodels`, {
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
    

    return (
        <div style={{ padding: "20px" }} className="allPages">
            <h1>My Models</h1>
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

export default MyModels;
