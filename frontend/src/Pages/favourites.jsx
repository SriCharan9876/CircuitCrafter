import { useState,useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { notify } from "../features/toastManager";
import ModelBox from "../features/ModelBox";

const favourites=()=>{
    const { token } = useAuth(); // use context
    const [favModels, setfavModels] = useState([]);
    const [loadingModels,setLoadingModels]=useState(false);
    const getModels = async () => {
        try {
            setLoadingModels(true);
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
        }finally{
            setLoadingModels(false);
        }
    };
    useEffect(()=>{
        getModels();
    },[])
    return(
        <div className="allPages">
            <div className="favmodels-page" style={{padding:"3rem 3rem", minHeight:"50vh"}}>
                <div className="subnavbar">
                    <h1 style={{textAlign:"center", marginBottom:"3rem", color:"var(--text-primary)"}}>Explore your saved models</h1>
                </div>
                {favModels.length === 0 ? loadingModels?(
                <h1 style={{color:"var(--text-primary)"}}>Loading Saved models.....</h1>
                ):(
                    <h1 style={{color:"var(--text-primary)"}}>No Saved models found</h1>
                )  : (
                <div className="model-grid">
                    {favModels.map((model) => (
                    <ModelBox model={model} key={model._id} onDelete={getModels} />
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}
export default favourites;