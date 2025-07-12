import { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";
import ModelBox from "../features/ModelBox";
const Favorities=()=>{
    const { user, token } = useAuth(); // use context
    const navigate=useNavigate();
    const [favModels, setfavModels] = useState([]);
    const getModels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/favModels`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                setfavModels(res.data.favModels);
            } else {
                notify.error("Failed to fetch models");
            }
        } catch (err) {
            console.error("Error fetching models:", err);
            notify.error("Error occurred while fetching models")
        }
    };
    useEffect(()=>{
        getModels();
    },[])
    return(
        <div className="allPages">
            <div className="subnavbar">
                <h1>Saved Models</h1>
                Filters
            </div>
            {favModels.length === 0 ? (
              <p>Loading models....</p>
            ) : (
              <div className="model-grid">
                {favModels.map((model) => (
                  <ModelBox model={model} key={model._id} onDelete={getModels} />
                ))}
              </div>
            )}
        </div>
    );
}
export default Favorities;