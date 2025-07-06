import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ModelBox from "../features/ModelBox";
import { useNavigate } from "react-router-dom";
import "../Styles/explore.css"
import { useAuth } from "../contexts/authContext";

const Explore = () => {
    const { user, token } = useAuth(); // use context
    const navigate=useNavigate();
    const [allModels, setAllModels] = useState([]);

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

    useEffect(() => {
        getModels();
    }, [selectedCategory]);

    return (
        <div className="allPages">
            <h1>All Models</h1>
            {allModels.length === 0 ? (
              <p>Loading models....</p>
            ) : (
              <div className="model-grid">
                {allModels.map((model) => (
                  <ModelBox model={model} key={model._id} onDelete={getModels} />
                ))}
              </div>
            )}
        </div>
    );
};

export default Explore;
