import React, { useState, useEffect } from "react";
import axios from "axios";
import ModelBox from "../features/ModelBox";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const PendingModels = () => {
    const token = localStorage.getItem("token");
    const [allModels, setAllModels] = useState([]);
    const [userData,setUserData]=useState({});
    const navigate=useNavigate();
    useEffect(()=>{
        const check_login=()=>{
            if(token){
                try{
                    const user=jwtDecode(token);
                    console.log(user);
                    setUserData(user);
                    if(user.role!="admin"){
                        alert("login as admin");
                        navigate("/login");
                    }else{
                        getModels();
                    }
                }catch(err){
                    console.log(err);
                }
            }
        }
        check_login();
    },[])

    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/pending`, {
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
    }, []);
    

    return (
        <div style={{ padding: "20px" }} className="allPages">
            <h1>Models to be approved / rejected</h1>
            {allModels.length === 0 ? (
                <p>Loading models....</p>
            ) : (
              <div className="model-grid">
                {allModels.map((model) => (
                    <ModelBox model={model} key={model._id} onDelete={getModels}/>
                ))}
              </div>

            )}
              </div>

        // </div>
    );
};

export default PendingModels;
